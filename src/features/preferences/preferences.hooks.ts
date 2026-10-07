import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setColorSchemePreference } from "./preferences.slice";
import { ColorSchemePreference } from "./preferences.types";

export function usePreferencesActionsHook() {
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppSelector((state) => state.preferencesSlice);

  const updateColorScheme = (preference: ColorSchemePreference) => {
    dispatch(setColorSchemePreference(preference));
  };

  return { colorSchemePreference: colorScheme, updateColorScheme };
}
