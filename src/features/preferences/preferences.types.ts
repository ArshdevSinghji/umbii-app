// "system" follows the device's light/dark setting.
export type ColorSchemePreference = "light" | "dark" | "system";

export interface PreferencesState {
  colorScheme: ColorSchemePreference;
}
