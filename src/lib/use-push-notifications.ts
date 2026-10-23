import { useNotificationsActionsHook } from "@/features/notifications/notifications.hooks";
import { endSessionLocally, reportRequestError } from "@/lib/http-client";
import {
  isKnownDeviceToken,
  PushData,
  SIGNED_OUT_ELSEWHERE,
} from "@/lib/push-notifications";
import { useAppSelector } from "@/store/hooks";
import * as Notifications from "expo-notifications";
import { Href, useRouter } from "expo-router";
import { useEffect } from "react";

const getData = (notification: Notifications.Notification) =>
  notification.request.content.data as PushData | undefined;

// Push for a signed-in, onboarded user. Mounted in the tabs layout, which
// stays mounted under every signed-in screen; waits for the profile so the
// permission prompt comes after onboarding, never before.
export function usePushNotifications() {
  const router = useRouter();
  const { user, profile } = useAppSelector((state) => state.userSlice);
  const { registerPushDevice } = useNotificationsActionsHook();
  const isReady = !!user.id && !!profile;

  // Register on every launch and sign-in, and again whenever the token
  // changes (old tokens stop working).
  useEffect(() => {
    if (!isReady) return;
    const register = (prompt: "once" | "never") =>
      registerPushDevice(user.id, prompt).catch((error) =>
        reportRequestError("Push registration failed:", error),
      );

    register("once");
    const subscription = Notifications.addPushTokenListener((token) => {
      // Android also fires this for every token fetch, ours included; only
      // a token we haven't seen is a real change.
      if (isKnownDeviceToken(token.data)) return;
      register("never");
    });
    return () => subscription.remove();
    // Once per signed-in user; the hook's functions are stable enough here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user.id]);

  useEffect(() => {
    if (!isReady) return;

    // The server ended this session (signed in on another device). The
    // push may never arrive; the refresh call's 401 is the reliable signal,
    // this just reacts sooner.
    const onData = (data?: PushData) => {
      if (data?.type === SIGNED_OUT_ELSEWHERE) {
        endSessionLocally("session-ended");
        return true;
      }
      return false;
    };

    const onTap = (response: Notifications.NotificationResponse) => {
      // Every tap is kept as the "last response"; clear it so a later mount
      // (e.g. after signing in again) doesn't replay it.
      Notifications.clearLastNotificationResponseAsync();
      const data = getData(response.notification);
      if (onData(data)) return;
      if (typeof data?.route === "string") router.push(data.route as Href);
    };

    // A tap that launched the app never reaches the listener; it's here.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) onTap(response);
    });

    const tapSubscription =
      Notifications.addNotificationResponseReceivedListener(onTap);
    // Arrived while the app is open (no tap needed to act on it).
    const receiveSubscription = Notifications.addNotificationReceivedListener(
      (notification) => onData(getData(notification)),
    );
    return () => {
      tapSubscription.remove();
      receiveSubscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);
}
