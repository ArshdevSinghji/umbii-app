import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteUserAction } from "./delete-user/delete-user.action";
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

  return {
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
