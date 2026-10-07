import { createSlice } from "@reduxjs/toolkit";
import { signInAction } from "./sign-in/sign-in.action";
import { updateUserAction } from "./update-user/update-user.action";
import { IUser, UserState } from "./user.types";

const initialState: UserState = {
  isLoading: false,
  isUpdating: false,
  user: {} as IUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = {} as IUser;
      state.isLoading = false;
      state.isUpdating = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signInAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserAction.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateUserAction.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Merge so the persisted token survives; the response has no token.
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserAction.rejected, (state) => {
        state.isUpdating = false;
      })
  },
});

export const { clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
