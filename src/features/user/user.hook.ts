import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { patchUserProfileAction } from "./patch-user-profile/patch-user-profile.action";
import type { ProfileChanges } from "./patch-user-profile/patch-user-profile.types";
import { getUserAction } from "./get-user/get-user.action";
import { getUserProfileAction } from "./get-user-profile/get-user-profile.action";
import { saveUserOnboardingAction } from "./save-user-onboarding/save-user-onboarding.action";
import { UserOnboardingAnswers } from "./save-user-onboarding/save-user-onboarding.types";

export function useUserActionsHook() {
  const dispatch = useAppDispatch();
  const {
    user,
    isUpdating,
    profile,
    profileStatus,
    isSavingOnboarding,
    isPatchingProfile,
  } = useAppSelector((state) => state.userSlice);

  // The account (name, email, picture).
  const fetchUser = async (userId: number) => {
    return await dispatch(getUserAction({ userId })).unwrap();
  };

  // The onboarding answers. Resolves with the profile, or null before
  // onboarding.
  const fetchProfile = async (userId: number) => {
    return await dispatch(getUserProfileAction({ userId })).unwrap();
  };

  // Saves the onboarding answers. Resolves with the generated target.
  const saveUserOnboarding = async (
    userId: number,
    answers: UserOnboardingAnswers,
  ) => {
    return await dispatch(
      saveUserOnboardingAction({ userId, ...answers }),
    ).unwrap();
  };

  // Changes any onboarding answers (allergies aside). This regenerates the
  // nutrition target. Resolves with the new profile and target.
  const patchUserProfile = async (userId: number, changes: ProfileChanges) => {
    return await dispatch(
      patchUserProfileAction({ userId, ...changes }),
    ).unwrap();
  };

  return {
    isPatchingProfile,
    patchUserProfile,
    user,
    isUpdating,
    profile,
    profileStatus,
    isSavingOnboarding,
    fetchUser,
    fetchProfile,
    saveUserOnboarding,
  };
}
