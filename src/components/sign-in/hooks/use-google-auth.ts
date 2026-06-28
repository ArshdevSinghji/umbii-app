import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export function useGoogleAuth() {
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
        console.log("Signed in successfully");
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
    }
  };

  return { signInWithGoogle };
}
