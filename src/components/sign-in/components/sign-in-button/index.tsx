import GoogleLogo from "@/assets/icons/google-icon.svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useGoogleAuth } from "../../hooks/use-google-auth";
import { ActivityIndicator } from "react-native";

export default function SignInButton() {
  const { signInWithGoogle, isLoading } = useGoogleAuth();

  return (
    <Button onPress={signInWithGoogle}>
      {isLoading ? <ActivityIndicator className="text-primary-foreground"/> : <GoogleLogo width={20} height={20} />}
      <Text className="ml-1">Sign in with Google</Text>
    </Button>
  );
}
