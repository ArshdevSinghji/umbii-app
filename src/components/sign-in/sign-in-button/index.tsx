import GoogleLogo from "@/assets/icons/google-icon.svg";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function SignInButton() {
  return (
    <Button variant={"outline"}>
      <GoogleLogo width={20} height={20} />
      <Text>Sign in with Google</Text>
    </Button>
  );
}
