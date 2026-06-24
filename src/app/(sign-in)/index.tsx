import SignInComponent from "@/components/sign-in";
import { Stack } from "expo-router";

export default function SignIn() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SignInComponent />
    </>
  );
}
