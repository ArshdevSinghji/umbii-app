import { signInAction } from "@/features/user/sign-in/sign-in.action";
import { eventBus } from "@/lib/event-bus";
import { saveToken } from "@/lib/token";
import { useAppDispatch } from "@/store/hooks";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export function useGoogleAuth() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { user } = response.data;
        const payload = {
          username: user.name ?? user.email.split("@")[0],
          email: user.email,
          imageUrl: user.photo ?? undefined,
        };

        const res = await dispatch(signInAction(payload));
        if (signInAction.fulfilled.match(res)) {
          const { token } = res.payload;
          await saveToken(token);
          eventBus.emit("auth:signin", { token });
        }
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log("User cancelled sign in");
            break;
          case statusCodes.IN_PROGRESS:
            console.log("Sign in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play services not available");
            break;
          default:
            console.error(error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { signInWithGoogle, isLoading };
}
