import {
  getExpoPushToken,
  getPushPermission,
  requestPushPermission,
} from "@/lib/push-notifications";
import { getTimezone } from "@/lib/timezone";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Platform } from "react-native";
import { getNotificationPreferencesAction } from "./get-notification-preferences/get-notification-preferences.action";
import {
  loadPushSetting,
  markPushPrompted,
  savePushSetting,
  wasPushPrompted,
} from "./notifications.storage";
import { INotificationPreferences } from "./notifications.types";
import { patchNotificationPreferencesAction } from "./patch-notification-preferences/patch-notification-preferences.action";
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
  const { pushDeviceId, preferences, isPreferencesLoading } = useAppSelector(
    (state) => state.notificationsSlice,
  );

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
        timezone: getTimezone(),
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

  const fetchPreferences = async (userId: number) => {
    await dispatch(getNotificationPreferencesAction({ userId })).unwrap();
  };

  // Saves only the changed fields. Shown at once; if the save fails, the
  // saved values are reloaded and the error rethrown.
  const updatePreferences = async (
    userId: number,
    changes: Partial<INotificationPreferences>,
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
    preferences,
    isPreferencesLoading,
    registerPushDevice,
    enablePush,
    disablePush,
    fetchPreferences,
    updatePreferences,
  };
}
