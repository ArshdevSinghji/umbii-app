import { Stack } from "expo-router";
import { Text, View } from "react-native";

const SCREEN_OPTIONS = {
  name: "SignIn",
  headerShown: false,
};

export default function Index() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center bg-red-500">
        <Text className="text-2xl font-bold">Welcome to Nativewind!</Text>
        <Text>This is the second paragraph.</Text>
      </View>
    </>
  );
}
