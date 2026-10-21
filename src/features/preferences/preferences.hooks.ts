import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { saveColorSchemePreference } from "./preferences.storage";
import { setColorSchemePreference } from "./preferences.slice";
import { ColorSchemePreference } from "./preferences.types";

export function usePreferencesActionsHook() {
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppSelector((state) => state.preferencesSlice);

  const updateColorScheme = (preference: ColorSchemePreference) => {
    dispatch(setColorSchemePreference(preference));
    saveColorSchemePreference(preference).catch((error) =>
      console.error("Saving theme failed:", error),
    );
  };

  return { colorSchemePreference: colorScheme, updateColorScheme };
}
