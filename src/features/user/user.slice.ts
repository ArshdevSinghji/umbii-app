import { createSlice } from "@reduxjs/toolkit";
import { signInAction } from "./sign-in/sign-in.action";
import { IUser, UserState } from "./user.types";

const initialState: UserState = {
  isLoading: false,
  user: {} as IUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(signInAction.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {} = userSlice.actions;
export const userReducer = userSlice.reducer;
