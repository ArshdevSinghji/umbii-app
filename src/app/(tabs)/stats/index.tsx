import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Stats() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1">
        <Text>Welcome to the Stats Screen</Text>
      </View>
    </>
  );
}
