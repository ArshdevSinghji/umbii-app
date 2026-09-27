import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { useAppSelector } from "@/store/hooks";
import {
  getDateRangeForPeriod,
  getDaysInRange,
} from "@/utils/get-date-range-for-period";
import { useEffect, useState } from "react";
import { View } from "react-native";
import CalorieSummary from "./calorie-summary";
import BreakdownHeader from "./header";
import DailyBreakdownSkeleton from "./loading";
import NutrientsList from "./nutrients-list";
import PeriodFilter, { StatsPeriod } from "./period-filter";

export default function DailyBreakdown() {
  const [period, setPeriod] = useState<StatsPeriod>("day");

  const { user } = useAppSelector((state) => state.userSlice);
  const {
    isLoading: isFoodLogsLoading,
    listFoodLogs,
    fetchFoodLogs,
  } = useFoodLogsActionsHook();
  const {
    isLoading: isTargetLoading,
    nutritionTarget,
    fetchNutritionTarget,
  } = useNutritionTargetActionsHook();

  const { startDate, endDate } = getDateRangeForPeriod(period);
  const days = getDaysInRange(startDate, endDate);

  useEffect(() => {
    if (!user.id) return;
    fetchNutritionTarget(user.id);
  }, [user.id]);

  useEffect(() => {
    if (!user.id) return;
    fetchFoodLogs(user.id, { startDate, endDate });
  }, [user.id, startDate, endDate]);

  const isLoading = isFoodLogsLoading || isTargetLoading;

  const handleCalendarPress = () => {
    // TODO: wire up date selection for the breakdown page.
  };

  if (isLoading) {
    return (
      <View>
        <BreakdownHeader onCalendarPress={handleCalendarPress} />
        <PeriodFilter value={period} onChange={setPeriod} />
        <View className="mt-4">
          <DailyBreakdownSkeleton />
        </View>
      </View>
    );
  }

  const total = calculateNutrition(listFoodLogs.flatMap((log) => log.details));
  const average: NutritionValues = {
    calories: total.calories / days,
    protein: total.protein / days,
    carbs: total.carbs / days,
    fats: total.fats / days,
    fiber: total.fiber / days,
    sugar: total.sugar / days,
    sodium: total.sodium / days,
  };

  const target = {
    calories: nutritionTarget?.calories ?? 0,
    protein: nutritionTarget?.protein ?? 0,
    carbs: nutritionTarget?.carbs ?? 0,
    fats: nutritionTarget?.fats ?? 0,
    fiber: nutritionTarget?.fiber ?? 0,
    sugar: nutritionTarget?.sugar ?? 0,
    sodium: nutritionTarget?.sodium ?? 0,
  };

  return (
    <View>
      <BreakdownHeader onCalendarPress={handleCalendarPress} />
      <PeriodFilter value={period} onChange={setPeriod} />

      <View className="gap-4 mt-4">
        <CalorieSummary
          dailyAverage={average.calories}
          totalCalories={total.calories}
          caloriesTarget={target.calories}
          protein={average.protein}
          carbs={average.carbs}
          fats={average.fats}
        />
        <NutrientsList consumed={average} target={target} />
      </View>
    </View>
  );
}
