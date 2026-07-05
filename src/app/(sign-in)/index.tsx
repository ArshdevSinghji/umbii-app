import SignInComponent from "@/components/sign-in";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1">
        <SignInComponent />
      </SafeAreaView>
    </>
  );
}
