import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ColorSchemePreference, PreferencesState } from "./preferences.types";

const initialState: PreferencesState = {
  // The app has only ever been light; keep that until the user picks otherwise.
  colorScheme: "light",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setColorSchemePreference: (
      state,
      action: PayloadAction<ColorSchemePreference>,
    ) => {
      state.colorScheme = action.payload;
    },
  },
});

export const { setColorSchemePreference } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
