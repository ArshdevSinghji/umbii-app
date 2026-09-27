import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import MacroChip from "./macro-chip";

interface IProps {
  dailyAverage: number;
  totalCalories: number;
  caloriesTarget: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function CalorieSummary({
  dailyAverage,
  totalCalories,
  caloriesTarget,
  protein,
  carbs,
  fats,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Card className="items-center gap-4 py-6 px-4">
      <View className="w-full items-start gap-0.5">
        <Text className="text-3xl font-sans-bold">
          {dailyAverage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <Text className="text-muted-foreground text-sm">Daily Average</Text>
        <Text className="text-muted-foreground text-xs mt-1">
          {totalCalories.toLocaleString(undefined, { maximumFractionDigits: 0 })} kcal total
        </Text>
      </View>

      <CircularProgress
        value={dailyAverage}
        max={caloriesTarget || 1}
        color={theme.primary}
        size={140}
        strokeWidth={14}
        trackStrokeWidth={14}
      >
        <View className="items-center">
          <Text className="text-2xl font-sans-bold">
            {dailyAverage.toFixed(0)}
            <Text className="text-base text-muted-foreground font-sans-bold">
              {" "}
              / {caloriesTarget.toFixed(0)}
            </Text>
          </Text>
          <Text className="text-muted-foreground text-sm">Calories</Text>
        </View>
      </CircularProgress>

      <View className="flex-row gap-3 w-full">
        <MacroChip label="Protein" value={protein} color={theme.chart1} />
        <MacroChip label="Carbs" value={carbs} color={theme.chart2} />
        <MacroChip label="Fats" value={fats} color={theme.chart4} />
      </View>
    </Card>
  );
}
