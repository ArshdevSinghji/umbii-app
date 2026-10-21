import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorSchemePreference } from "./preferences.types";

// The theme choice is the one setting kept across launches. Not a secret, so
// plain AsyncStorage rather than SecureStore.
const COLOR_SCHEME_KEY = "color_scheme";

const isColorSchemePreference = (
  value: string | null,
): value is ColorSchemePreference =>
  value === "light" || value === "dark" || value === "system";

export const loadColorSchemePreference = async () => {
  const value = await AsyncStorage.getItem(COLOR_SCHEME_KEY).catch(() => null);
  return isColorSchemePreference(value) ? value : null;
};

export const saveColorSchemePreference = async (
  preference: ColorSchemePreference,
) => {
  await AsyncStorage.setItem(COLOR_SCHEME_KEY, preference);
};
