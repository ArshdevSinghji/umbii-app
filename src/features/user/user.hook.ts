import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteUserAction } from "./delete-user/delete-user.action";
import { patchUserProfileAction } from "./patch-user-profile/patch-user-profile.action";
import { getUserAction } from "./get-user/get-user.action";
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
    isDeleting,
    isPatchingProfile,
  } = useAppSelector((state) => state.userSlice);

  // The account and its onboarding profile. Resolves with the profile, or
  // null before onboarding.
  const fetchUser = async (userId: number) => {
    const response = await dispatch(getUserAction({ userId })).unwrap();
    return response.profile;
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

  // Deletes the account for good. Sign out afterwards.
  const deleteUser = async (userId: number) => {
    await dispatch(deleteUserAction({ userId })).unwrap();
  };

  // Changes height and/or target weight. This regenerates the nutrition
  // target, so ask the user first. Resolves with the new profile and target.
  const patchUserProfile = async (
    userId: number,
    changes: { heightCm?: number; targetWeightKg?: number },
  ) => {
    return await dispatch(
      patchUserProfileAction({ userId, ...changes }),
    ).unwrap();
  };

  return {
    isPatchingProfile,
    patchUserProfile,
    isDeleting,
    deleteUser,
    user,
    isUpdating,
    profile,
    profileStatus,
    isSavingOnboarding,
    fetchUser,
    saveUserOnboarding,
  };
}
