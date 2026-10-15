import { reportRequestError } from "@/lib/http-client";
import { useRefresh } from "@/lib/pull-to-refresh";
import { GradientCard } from "@/components/ui/gradient-card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { Avocado } from "phosphor-react-native/src/icons/Avocado";
import { Egg } from "phosphor-react-native/src/icons/Egg";
import { Fire } from "phosphor-react-native/src/icons/Fire";
import { Grains } from "phosphor-react-native/src/icons/Grains";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo } from "react";
import { View } from "react-native";
import GoalProgress from "./goal-progress";
import TodaysGoalSkeleton from "./loading";

export default function TodaysGoal() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  const { isListLoading: isLoading, listFoodLogs } = useFoodLogsActionsHook();
  const {
    isLoading: isNutritionTargetLoading,
    nutritionTarget,
    fetchNutritionTarget,
  } = useNutritionTargetActionsHook();

  useEffect(() => {
    if (!user.id) return;
    fetchNutritionTarget(user.id).catch((error) =>
      reportRequestError("Error fetching target:", error),
    );
  }, [user.id]);

  useRefresh(() => fetchNutritionTarget(user.id));

  const nutrition = useMemo(() => {
    const allDetails = listFoodLogs.flatMap((log) => log.details);
    return calculateNutrition(allDetails);
  }, [listFoodLogs]);

  const goal = {
    calories: nutritionTarget?.calories ?? 0,
    protein: nutritionTarget?.protein ?? 0,
    carbs: nutritionTarget?.carbs ?? 0,
    fat: nutritionTarget?.fats ?? 0,
  };

  if (isLoading) {
    return <TodaysGoalSkeleton />;
  }

  return (
    <GradientCard className="mt-8 shadow-none px-4 gap-3">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm">{`Today's Goal`}</Text>
          <View className="flex-row items-end gap-2">
            <Text className="text-3xl font-sans-bold">
              {nutrition.calories}
            </Text>
            {isNutritionTargetLoading ? (
              <Skeleton className="h-6 w-10 rounded-md mb-1" />
            ) : (
              <Text className="text-xl text-muted-foreground font-sans-bold mb-0.5">
                / {goal.calories}
              </Text>
            )}
          </View>
        </View>
        {isNutritionTargetLoading ? (
          <Skeleton className="h-20 w-20 rounded-full" />
        ) : (
          <CircularProgress
            value={nutrition.calories}
            max={goal.calories}
            color={theme.primary}
            size={80}
            strokeWidth={10}
            trackStrokeWidth={5}
          >
            <View className="p-1 bg-primary rounded-full">
              <Fire size={20} color={theme.background} weight="fill" />
            </View>
          </CircularProgress>
        )}
      </View>

      <Separator />

      <View className="flex-row gap-2">
        <GoalProgress
          isLoading={isNutritionTargetLoading}
          value={nutrition.protein}
          max={goal.protein}
          name="Protein"
          color={theme.chart1}
          icon={<Egg size={12} color={theme.chart1} weight="fill" />}
        />

        <GoalProgress
          isLoading={isNutritionTargetLoading}
          value={nutrition.carbs}
          max={goal.carbs}
          name="Carbs"
          color={theme.chart2}
          icon={<Grains size={12} color={theme.chart2} weight="fill" />}
        />

        <GoalProgress
          isLoading={isNutritionTargetLoading}
          value={nutrition.fats}
          max={goal.fat}
          name="Fat"
          color={theme.chart4}
          icon={<Avocado size={12} color={theme.chart4} weight="fill" />}
        />
      </View>
    </GradientCard>
  );
}
