import { createSlice } from "@reduxjs/toolkit";
import { listFoodLogsAction } from "./list-food-logs/list-food-logs.action";
import { signInAction } from "./sign-in/sign-in.action";
import { IUser, UserState } from "./user.types";

const initialState: UserState = {
  isLoading: false,
  user: {} as IUser,
  listFoodLogs: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = {} as IUser;
      state.isLoading = false;
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
      .addCase(listFoodLogsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listFoodLogsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listFoodLogs = action.payload;
      })
      .addCase(listFoodLogsAction.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
