import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { Utensils } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

// No button: the food input sits right below, so the copy points to it.
export default function MealsEmptyState() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Card className="items-center gap-4 px-6 py-8">
      <View className="rounded-full bg-muted p-4">
        <Utensils size={28} color={theme.foreground} />
      </View>
      <View className="items-center gap-1">
        <Text className="font-sans-bold text-lg">No meals logged yet</Text>
        <Text className="text-center text-sm text-muted-foreground">
          Describe what you ate in the box below, and your meals will show up
          here.
        </Text>
      </View>
    </Card>
  );
}
