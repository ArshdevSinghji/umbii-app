import GoogleLogo from "@/assets/icons/google-icon.svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useGoogleAuth } from "../../hooks/use-google-auth";

export default function SignInButton() {
  const { signInWithGoogle } = useGoogleAuth();

  return (
    <Button onPress={signInWithGoogle}>
      <GoogleLogo width={20} height={20} />
      <Text>Sign in with Google</Text>
    </Button>
  );
}
