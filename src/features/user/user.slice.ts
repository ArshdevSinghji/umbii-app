import { createSlice } from "@reduxjs/toolkit";
import { deleteUserAction } from "./delete-user/delete-user.action";
import { patchUserProfileAction } from "./patch-user-profile/patch-user-profile.action";
import { getUserAction } from "./get-user/get-user.action";
import { saveUserOnboardingAction } from "./save-user-onboarding/save-user-onboarding.action";
import { signInAction } from "./sign-in/sign-in.action";
import { updateUserAction } from "./update-user/update-user.action";
import { IUser, UserState } from "./user.types";

const initialState: UserState = {
  isLoading: false,
  isUpdating: false,
  user: {} as IUser,
  profile: null,
  profileStatus: "idle",
  isSavingOnboarding: false,
  isDeleting: false,
  isPatchingProfile: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = {} as IUser;
      state.isLoading = false;
      state.isUpdating = false;
      state.profile = null;
      state.profileStatus = "idle";
      state.isSavingOnboarding = false;
      state.isDeleting = false;
      state.isPatchingProfile = false;
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
      .addCase(getUserAction.pending, (state) => {
        // A refresh keeps showing what's already loaded.
        if (state.profileStatus !== "ready") state.profileStatus = "loading";
      })
      // Refreshes the persisted account (merged: the response has no token)
      // and holds the profile apart, unpersisted.
      .addCase(getUserAction.fulfilled, (state, action) => {
        const { profile, ...account } = action.payload;
        state.user = { ...state.user, ...account };
        state.profile = profile;
        state.profileStatus = "ready";
      })
      .addCase(getUserAction.rejected, (state) => {
        if (state.profileStatus !== "ready") state.profileStatus = "error";
      })
      .addCase(saveUserOnboardingAction.pending, (state) => {
        state.isSavingOnboarding = true;
      })
      .addCase(saveUserOnboardingAction.fulfilled, (state) => {
        // The saved profile is reloaded right after (GET /users/{id}).
        state.isSavingOnboarding = false;
      })
      .addCase(saveUserOnboardingAction.rejected, (state) => {
        state.isSavingOnboarding = false;
      })
      // On success the caller signs out, which clears the user.
      .addCase(deleteUserAction.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteUserAction.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteUserAction.rejected, (state) => {
        state.isDeleting = false;
      })
      .addCase(patchUserProfileAction.pending, (state) => {
        state.isPatchingProfile = true;
      })
      // The saved profile comes back whole; the new target goes to the
      // nutrition-target slice.
      .addCase(patchUserProfileAction.fulfilled, (state, action) => {
        state.isPatchingProfile = false;
        state.profile = action.payload.profile;
        state.profileStatus = "ready";
      })
      .addCase(patchUserProfileAction.rejected, (state) => {
        state.isPatchingProfile = false;
      });
  },
});

export const { clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
