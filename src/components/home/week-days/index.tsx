import { useRefresh } from "@/lib/pull-to-refresh";
import { useFocusEffect } from "expo-router";
import { reportRequestError } from "@/lib/http-client";
import { toLocalDateKey } from "@/utils/date";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { getCurrentWeek } from "@/utils/get-current-week";
import { CheckCircle } from "phosphor-react-native/src/icons/CheckCircle";
import { useColorScheme } from "nativewind";
import { useCallback } from "react";
import { Pressable, View } from "react-native";

interface IProps {
  date: string;
  handleDatePress: (date: string) => void;
}

export default function WeekDays({ date, handleDatePress }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  const { report, fetchNutritionTargetReport } =
    useNutritionTargetActionsHook();

  const week = getCurrentWeek();
  const today = toLocalDateKey();

  // Refetch on every focus too, so the completed / incomplete circles reflect
  // meals logged on another tab.
  useFocusEffect(
    useCallback(() => {
      if (!user.id) return;
      fetchNutritionTargetReport(user.id, {
        startDate: week[0].fullDate,
        endDate: today,
      }).catch((error) => reportRequestError("Error fetching report:", error));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id, today]),
  );

  useRefresh(() =>
    fetchNutritionTargetReport(user.id, {
      startDate: week[0].fullDate,
      endDate: today,
    }),
  );

  const completedDates = report?.completedDates ?? [];
  const notCompleteDates = report?.notCompleteDates ?? [];

  return (
    <View className="flex-row gap-1 mt-8">
      {week.map((day) => {
        const isSelected = day.fullDate === date;
        const isCompleted = completedDates.includes(day.fullDate);
        const isNotCompleted = notCompleteDates.includes(day.fullDate);

        return (
          <Pressable
            onPress={() => handleDatePress(day.fullDate)}
            key={day.date}
            className="flex-1"
          >
            <Card className="items-center gap-2 py-2 bg-muted">
              <Text className="text-xs font-sans-bold">{day.week}</Text>
              <View
                className={cn(
                  "rounded-full w-8 h-8 justify-center items-center relative",
                  isSelected
                    ? "bg-primary"
                    : isNotCompleted
                      ? "bg-card border border-dashed border-muted-foreground"
                      : "bg-card",
                )}
              >
                <Text
                  className={cn(
                    "font-sans-bold text-sm",
                    isSelected && "text-primary-foreground",
                  )}
                >
                  {day.date}
                </Text>

                {isCompleted && (
                  <View className="absolute top-0 -right-0.5">
                    {/* Green disc with the check cut out. */}
                    <CheckCircle size={12} weight="fill" color={theme.chart2} />
                  </View>
                )}
              </View>
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
}
