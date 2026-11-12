import Logo from "@/components/ui/logo";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function Header() {
  return (
    <View className="items-center gap-2">
      <Logo size="md" />
      <Text className="text-sm text-muted-foreground">
        Food journal for the Mindful Eater
      </Text>
    </View>
  );
}
