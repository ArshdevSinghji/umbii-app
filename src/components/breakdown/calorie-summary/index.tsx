import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { Flame } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ReactNode } from "react";
import { View } from "react-native";
import MacroChip from "./macro-chip";

// Same flame orange calories use on the meal cards and Home.
export const CALORIE_COLOR = "#FF5A00";
const SCALE_STEP = 500;

// Bar runs from 0 to a round number at or above both the target and the
// intake (1,938 target -> 2,000), so it has headroom and never overflows.
export const getCalorieScaleMax = (value: number, target: number) =>
  Math.max(
    SCALE_STEP,
    Math.ceil(Math.max(value, target) / SCALE_STEP) * SCALE_STEP,
  );

const formatKcal = (value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: 0 });

// What the number means: a single day's total or a per-day average.
export const getCalorieLabels = (isSingleDay: boolean, dayLabel?: string) =>
  isSingleDay
    ? { title: dayLabel ?? "Today's Calories", targetLabel: "Target" }
    : { title: "Avg. Daily Calories", targetLabel: "Avg. daily target" };

interface IProps {
  title: string;
  targetLabel: string;
  dailyAverage: number;
  caloriesTarget: number;
  protein: number;
  carbs: number;
  fats: number;
  // Top-right of the card, e.g. the period dropdown.
  action?: ReactNode;
}

export default function CalorieSummary({
  title,
  targetLabel,
  dailyAverage,
  caloriesTarget,
  protein,
  carbs,
  fats,
  action,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const scaleMax = getCalorieScaleMax(dailyAverage, caloriesTarget);

  return (
    <Card className="gap-4 px-4 py-4">
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-row items-center gap-2">
          <View
            className="rounded-xl p-2"
            style={{ backgroundColor: "rgba(255, 90, 0, 0.12)" }}
          >
            <Flame size={16} color={CALORIE_COLOR} fill={CALORIE_COLOR} />
          </View>
          <Text className="font-sans-bold">{title}</Text>
        </View>
        {action}
      </View>

      <View className="gap-0.5">
        <Text className="text-3xl font-sans-bold">
          {formatKcal(dailyAverage)} Kcal
        </Text>
        <Text className="text-sm text-muted-foreground">
          {caloriesTarget > 0
            ? `${targetLabel}: ${formatKcal(caloriesTarget)} Kcal`
            : "No target set"}
        </Text>
      </View>

      <View className="gap-1.5">
        <Progress
          value={(dailyAverage / scaleMax) * 100}
          className="h-5 bg-muted"
          indicatorClassName="bg-[#FF5A00]"
        />
        <View className="flex-row justify-between">
          <Text className="text-xs text-muted-foreground">0</Text>
          <Text className="text-xs text-muted-foreground">
            {formatKcal(scaleMax)}
          </Text>
        </View>
      </View>

      <Separator />

      <View className="flex-row gap-3">
        <MacroChip label="Protein" value={protein} color={theme.chart1} />
        <MacroChip label="Carbs" value={carbs} color={theme.chart2} />
        <MacroChip label="Fats" value={fats} color={theme.chart4} />
      </View>
    </Card>
  );
}
