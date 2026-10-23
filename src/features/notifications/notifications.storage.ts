import AsyncStorage from "@react-native-async-storage/async-storage";

// This device's push choices, kept across launches. Not secrets, so plain
// AsyncStorage. Per device, not per account.
const PUSH_SETTING_KEY = "push_notifications";
const PUSH_PROMPTED_KEY = "push_permission_prompted";

// "off" once the user turns push off in the app; nothing saved means on.
export type PushSetting = "on" | "off";

export const loadPushSetting = async (): Promise<PushSetting> => {
  const value = await AsyncStorage.getItem(PUSH_SETTING_KEY).catch(() => null);
  return value === "off" ? "off" : "on";
};

export const savePushSetting = async (setting: PushSetting) => {
  await AsyncStorage.setItem(PUSH_SETTING_KEY, setting);
};

// The automatic permission prompt (after onboarding) runs once; after that
// only the Notifications screen asks.
export const wasPushPrompted = async () => {
  const value = await AsyncStorage.getItem(PUSH_PROMPTED_KEY).catch(() => null);
  return value === "true";
};

export const markPushPrompted = async () => {
  await AsyncStorage.setItem(PUSH_PROMPTED_KEY, "true");
};
