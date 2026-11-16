import {
  getExpoPushToken,
  getPushPermission,
  requestPushPermission,
} from "@/lib/push-notifications";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Platform } from "react-native";
import { getNotificationPreferencesAction } from "./get-notification-preferences/get-notification-preferences.action";
import { getReminderPreferencesAction } from "./get-reminder-preferences/get-reminder-preferences.action";
import {
  loadPushSetting,
  markPushPrompted,
  savePushSetting,
  wasPushPrompted,
} from "./notifications.storage";
import { patchNotificationPreferencesAction } from "./patch-notification-preferences/patch-notification-preferences.action";
import { NotificationPreferenceChanges } from "./patch-notification-preferences/patch-notification-preferences.types";
import { patchReminderPreferencesAction } from "./patch-reminder-preferences/patch-reminder-preferences.action";
import { ReminderPreferenceChanges } from "./patch-reminder-preferences/patch-reminder-preferences.types";
import { registerPushDeviceAction } from "./register-push-device/register-push-device.action";
import { unregisterPushDeviceAction } from "./unregister-push-device/unregister-push-device.action";

// When to show the OS permission prompt: "once" for the automatic run after
// onboarding, "always" when the user turns push on, "never" for quiet
// re-registers (token changes).
type PromptMode = "once" | "always" | "never";

// What registering ended with. "blocked": denied and the OS won't ask
// again (only the phone's Settings can change it). "unavailable": no token,
// e.g. an emulator or a build without an EAS project id.
export type PushRegistrationResult =
  "registered" | "off" | "denied" | "blocked" | "unavailable";

export function useNotificationsActionsHook() {
  const dispatch = useAppDispatch();
  const { pushDeviceId, notificationPreferences, reminderPreferences } =
    useAppSelector((state) => state.notificationsSlice);

  // Registers this device for push if the user hasn't turned it off and the
  // OS allows it. Safe to repeat: the server upserts.
  const registerPushDevice = async (
    userId: number,
    prompt: PromptMode,
  ): Promise<PushRegistrationResult> => {
    if ((await loadPushSetting()) === "off") return "off";

    let permission = await getPushPermission();
    if (!permission.granted && permission.canAskAgain && prompt !== "never") {
      if (prompt === "always" || !(await wasPushPrompted())) {
        await markPushPrompted();
        permission = await requestPushPermission();
      }
    }
    if (!permission.granted) {
      return permission.canAskAgain ? "denied" : "blocked";
    }

    const expoPushToken = await getExpoPushToken();
    if (!expoPushToken) return "unavailable";

    await dispatch(
      registerPushDeviceAction({
        userId,
        expoPushToken,
        platform: Platform.OS === "ios" ? "ios" : "android",
      }),
    ).unwrap();
    return "registered";
  };

  // The in-app switch. Turning on asks for permission if needed.
  const enablePush = async (userId: number) => {
    await savePushSetting("on");
    return await registerPushDevice(userId, "always");
  };

  // Stops pushes to this device and keeps them off across launches.
  const disablePush = async (userId: number) => {
    await savePushSetting("off");
    if (pushDeviceId === null) return;
    await dispatch(
      unregisterPushDeviceAction({ userId, pushDeviceId }),
    ).unwrap();
  };

  // Both halves of the Notifications screen: which reminders (and when),
  // and how they're delivered (quiet hours).
  const fetchPreferences = async (userId: number) => {
    await Promise.all([
      dispatch(getReminderPreferencesAction({ userId })).unwrap(),
      dispatch(getNotificationPreferencesAction({ userId })).unwrap(),
    ]);
  };

  // Both save only the changed fields. Shown at once; if the save fails, the
  // saved values are reloaded and the error rethrown.
  const updateReminderPreferences = async (
    userId: number,
    changes: ReminderPreferenceChanges,
  ) => {
    try {
      await dispatch(
        patchReminderPreferencesAction({ userId, ...changes }),
      ).unwrap();
    } catch (error) {
      dispatch(getReminderPreferencesAction({ userId }));
      throw error;
    }
  };

  const updateNotificationPreferences = async (
    userId: number,
    changes: NotificationPreferenceChanges,
  ) => {
    try {
      await dispatch(
        patchNotificationPreferencesAction({ userId, ...changes }),
      ).unwrap();
    } catch (error) {
      dispatch(getNotificationPreferencesAction({ userId }));
      throw error;
    }
  };

  return {
    pushDeviceId,
    notificationPreferences,
    reminderPreferences,
    registerPushDevice,
    enablePush,
    disablePush,
    fetchPreferences,
    updateReminderPreferences,
    updateNotificationPreferences,
  };
}
