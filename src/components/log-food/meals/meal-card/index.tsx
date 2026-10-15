import { parseLocalDateKey } from "@/utils/date";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { IFoodLog } from "@/features/food-logs/food-logs.types";
import { THEME } from "@/lib/theme";
import { BookmarkCheck } from "lucide-react-native";
import MealMacros from "../../meal-macros";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";

// "Today", "Yesterday", the weekday within a week, else a short date.
const formatLoggedDay = (createdAt: string) => {
  // createdAt is a plain "yyyy-MM-dd": read it as a local date, since
  // new Date("yyyy-MM-dd") is UTC midnight (the previous day west of UTC).
  const date = parseLocalDateKey(createdAt.slice(0, 10));
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
  // Opens the meal sheet (details, and "Save as recipe" if it isn't one).
  onPress: (log: IFoodLog) => void;
}

// Not pressable: the food input stays in view, and calories / protein / fat
// are right on the card to help decide what to log next.
export default function MealCard({ log, onPress }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Pressable onPress={() => onPress(log)} className="active:opacity-70">
      <Card className="gap-2 px-4 py-3">
        {/* Name, plus a check when it's saved as a recipe. */}
        <View className="flex-row items-center justify-between gap-4">
          <Text className="flex-1 text-sm font-sans-bold" numberOfLines={1}>
            {log.rawInputText}
          </Text>
          {log.recipeId !== null && (
            <View accessibilityLabel="In your recipes">
              <BookmarkCheck
                size={16}
                color={theme.chart2}
                fill={theme.chart2}
              />
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <MealMacros details={log.details} />
          <Text className="text-xs text-muted-foreground">
            {formatLoggedDay(log.createdAt)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
