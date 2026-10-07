import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ColorSchemePreference, PreferencesState } from "./preferences.types";

const initialState: PreferencesState = {
  // Follow the device's light/dark setting until the user picks one.
  colorScheme: "system",
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
