import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { patchUserProfileAction } from "./patch-user-profile/patch-user-profile.action";
import { getUserAction } from "./get-user/get-user.action";
import { getUserProfileAction } from "./get-user-profile/get-user-profile.action";
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
  isPatchingProfile: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // At launch, from the saved session; the rest of the account is loaded
    // with GET /users/{id}, the profile with GET .../nutrition-profile.
    setUserId: (state, action: PayloadAction<number>) => {
      state.user = { id: action.payload } as IUser;
    },
    clearUser: (state) => {
      state.user = {} as IUser;
      state.isLoading = false;
      state.isUpdating = false;
      state.profile = null;
      state.profileStatus = "idle";
      state.isSavingOnboarding = false;
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
        // The tokens go to SecureStore only.
        const { token, refreshToken, ...user } = action.payload;
        state.user = user;
      })
      .addCase(signInAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserAction.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateUserAction.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Merge: the response leaves out fields kept from sign-in.
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserAction.rejected, (state) => {
        state.isUpdating = false;
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(getUserProfileAction.pending, (state) => {
        // A refresh keeps showing what's already loaded.
        if (state.profileStatus !== "ready") state.profileStatus = "loading";
      })
      // Null before onboarding.
      .addCase(getUserProfileAction.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileStatus = "ready";
      })
      .addCase(getUserProfileAction.rejected, (state) => {
        if (state.profileStatus !== "ready") state.profileStatus = "error";
      })
      .addCase(saveUserOnboardingAction.pending, (state) => {
        state.isSavingOnboarding = true;
      })
      .addCase(saveUserOnboardingAction.fulfilled, (state) => {
        // The saved profile is reloaded right after.
        state.isSavingOnboarding = false;
      })
      .addCase(saveUserOnboardingAction.rejected, (state) => {
        state.isSavingOnboarding = false;
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

export const { setUserId, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
