import { Text } from "@/components/ui/text";
import { IFoodLogDetail } from "@/features/food-logs/food-logs.types";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { THEME } from "@/lib/theme";
import { Flame } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

interface IProps {
  details: IFoodLogDetail[];
}

// "🔥 420 kcal · ● 24g protein · ● 11g fat", summed across a meal's items.
// Shared by meal and recipe cards. 20px tall (the flame chip).
export default function MealMacros({ details }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { calories, protein, fats } = calculateNutrition(details);

  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-row items-center gap-1.5">
        <View
          style={{ backgroundColor: "rgba(255, 90, 0, 0.12)" }}
          className="rounded-full p-1"
        >
          <Flame size={12} color="#FF5A00" fill="#FF5A00" />
        </View>
        <Text className="text-xs font-sans-bold">
          {calories.toFixed(0)} kcal
        </Text>
      </View>
      <Macro label="protein" grams={protein} color={theme.chart1} />
      <Macro label="fat" grams={fats} color={theme.chart4} />
    </View>
  );
}

function Macro({
  label,
  grams,
  color,
}: {
  label: string;
  grams: number;
  color: string;
}) {
  return (
    <View className="flex-row items-center gap-1">
      <View
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-xs text-muted-foreground">
        <Text className="text-xs font-sans-bold text-foreground">
          {grams.toFixed(0)}g
        </Text>{" "}
        {label}
      </Text>
    </View>
  );
}
