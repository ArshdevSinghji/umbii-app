import { EllipsisVertical } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "../ui/text";

export default function GoalProgress() {
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-bold">Goal Progress</Text>
        <View className="rounded-full bg-muted p-2">
          <EllipsisVertical size={16} />
        </View>
      </View>
    </View>
  );
}
