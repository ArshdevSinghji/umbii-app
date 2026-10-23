import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// The backend sends no channelId, so Android uses this one. On Android 13+
// a channel must exist before the permission prompt shows or a token can be
// fetched.
const DEFAULT_CHANNEL_ID = "default";

// Without a handler, pushes that arrive while the app is open aren't shown.
// Called once, at startup.
export function showNotificationsInForeground() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureDefaultChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
  });
}

export async function getPushPermission() {
  await ensureDefaultChannel();
  return await Notifications.getPermissionsAsync();
}

export async function requestPushPermission() {
  await ensureDefaultChannel();
  return await Notifications.requestPermissionsAsync();
}

// The FCM / APNs token behind the last Expo token fetched. Android fires the
// push-token event on every fetch, ours included, so the token listener
// checks this to ignore its own echoes (re-registering on them loops).
let lastDeviceToken: string | null = null;

export const isKnownDeviceToken = (token: string) => token === lastDeviceToken;

// The Expo push token, or null where push can't work: emulators, or a build
// without an EAS project id (`eas init`). Needs the network; a failure here
// is retried on the next launch.
export async function getExpoPushToken() {
  if (!Device.isDevice) return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    console.warn("Push: no EAS project id in app config; run `eas init`.");
    return null;
  }

  await ensureDefaultChannel();
  // Fetched here and passed on, so it's recorded before its echo arrives
  // and the Expo token call doesn't fetch it a second time.
  const devicePushToken = await Notifications.getDevicePushTokenAsync();
  lastDeviceToken = devicePushToken.data;
  const { data } = await Notifications.getExpoPushTokenAsync({
    projectId,
    devicePushToken,
  });
  return data;
}

// What every push carries. `route` is an app path to open on tap.
export type PushData = { type?: string; route?: string };

export const SIGNED_OUT_ELSEWHERE = "signed_out_elsewhere";
