import { signOutService } from "@/features/user/sign-out/sign-out.service";
import { clearUser } from "@/features/user/user.slice";
import { eventBus } from "@/lib/event-bus";
import { clearSession, getRefreshToken } from "@/lib/token";
import { useAppDispatch } from "@/store/hooks";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export function useSignOut() {
  const dispatch = useAppDispatch();

  const signOut = async () => {
    try {
      // Best effort: offline, the session still ends here, and the server's
      // refresh token expires on its own.
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await signOutService(refreshToken).catch((error) =>
          console.warn("Server sign out failed:", error),
        );
      }
      await GoogleSignin.signOut();
      await clearSession();
      dispatch(clearUser());
      eventBus.emit("auth:signout");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return { signOut };
}
