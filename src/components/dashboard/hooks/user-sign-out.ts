import { clearUser } from "@/features/user/user.slice";
import { eventBus } from "@/lib/event-bus";
import { deleteToken } from "@/lib/token";
import { useAppDispatch } from "@/store/hooks";
import { persistor } from "@/store/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export function useSignOut() {
  const dispatch = useAppDispatch();

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await deleteToken();
      await persistor.purge();
      dispatch(clearUser());
      eventBus.emit("auth:signout");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return { signOut };
}
