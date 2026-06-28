import SignInComponent from "@/components/sign-in";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function SignIn() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1">
        <SignInComponent />
      </View>
    </>
  );
}
