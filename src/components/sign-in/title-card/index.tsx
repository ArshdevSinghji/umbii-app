import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function TitleCard() {
  return (
    <View className="items-center">
      <Text className="text-[48px] font-sans-bold">umbii</Text>
      <Text className="text-sm text-muted-foreground">
        Food journal for the Mindful Eater
      </Text>
    </View>
  );
}
