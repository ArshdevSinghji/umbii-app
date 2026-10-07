import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUserAction } from "./update-user/update-user.action";

export function useUserActionsHook() {
  const dispatch = useAppDispatch();
  const { user, isUpdating } = useAppSelector((state) => state.userSlice);

  // The endpoint replaces the whole profile, so resend every current field
  // and only change height — otherwise imageUrl/phoneNumber would be cleared.
  const updateHeight = async (height: number) => {
    await dispatch(
      updateUserAction({
        userId: user.id,
        username: user.username,
        imageUrl: user.imageUrl ?? null,
        phoneNumber: user.phoneNumber ?? null,
        height,
      }),
    ).unwrap();
  };

  return { isUpdating, updateHeight };
}
