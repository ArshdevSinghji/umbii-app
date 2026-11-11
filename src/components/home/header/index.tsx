import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { ProfileAvatar } from "./profile-avatar";

export default function HomeDashboardHeader() {
  return (
    <View className="flex-row justify-between">
      <View>
        <Text>Welcome Back</Text>
        <Text className="text-2xl font-sans-bold">Stay on track today</Text>
      </View>
      <View className="mt-auto">
        <ProfileAvatar />
      </View>
    </View>
  );
}
