import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { Weight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

interface IProps {
  onGetStarted: () => void;
}

export default function WeightEmptyState({ onGetStarted }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Card className="items-center gap-4 px-6 py-8 rounded-2xl border-0">
      <View className="p-4 rounded-full bg-muted">
        <Weight size={28} color={theme.chart2} />
      </View>
      <View className="items-center gap-1">
        <Text className="font-sans-bold text-lg">Start tracking your weight</Text>
        <Text className="text-center text-sm text-muted-foreground">
          Log your current weight and set a goal to see your progress here.
        </Text>
      </View>
      <Button className="rounded-full" onPress={onGetStarted}>
        <Text>Get started</Text>
      </Button>
    </Card>
  );
}
