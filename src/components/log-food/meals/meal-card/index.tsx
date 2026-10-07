import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { THEME } from "@/lib/theme";
import { Flame } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

// "Today", "Yesterday", the weekday within a week, else a short date.
const formatLoggedDay = (createdAt: string) => {
  const date = new Date(createdAt);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 6);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  if (date >= weekAgo)
    return date.toLocaleDateString(undefined, { weekday: "long" });
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

interface IProps {
  log: IFoodLog;
}

// Not pressable: the food input stays in view, and calories / protein / fat
// are right on the card to help decide what to log next.
export default function MealCard({ log }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { calories, protein, fats } = calculateNutrition(log.details);

  return (
    <Card className="gap-2 px-4 py-3">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-sm font-sans-bold" numberOfLines={1}>
          {log.rawInputText}
        </Text>
        <Text className="text-xs text-muted-foreground">
          {formatLoggedDay(log.createdAt)}
        </Text>
      </View>

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
    </Card>
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
