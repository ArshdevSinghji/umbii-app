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
import AdherenceCalendar from "./adherence-calendar";
import CalorieSummary from "./calorie-summary";
import BreakdownHeader from "./header";
import DailyBreakdownSkeleton from "./loading";
import NutrientsList from "./nutrients-list";
import PeriodFilter, { StatsPeriod } from "./period-filter";

const TODAY = new Date().toISOString().split("T")[0];

export default function DailyBreakdown() {
  const [period, setPeriod] = useState<StatsPeriod>("day");
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

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

  const referenceDate = period === "day" ? new Date(selectedDate) : new Date();
  const { startDate, endDate } = getDateRangeForPeriod(period, referenceDate);
  const days = getDaysInRange(startDate, endDate);

  useEffect(() => {
    if (!user.id) return;
    fetchNutritionTarget(user.id, period === "day" ? selectedDate : undefined);
  }, [user.id, period, selectedDate]);

  useEffect(() => {
    if (!user.id) return;
    fetchFoodLogs(user.id, { startDate, endDate });
  }, [user.id, startDate, endDate]);

  const isLoading = isFoodLogsLoading || isTargetLoading;

  const handlePeriodChange = (newPeriod: StatsPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod === "day") {
      setSelectedDate(TODAY);
    }
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setPeriod("day");
  };

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
      <BreakdownHeader onCalendarPress={() => setIsCalendarVisible(true)} />
      <PeriodFilter value={period} onChange={handlePeriodChange} />

      <View className="gap-4 mt-4">
        {isLoading ? (
          <DailyBreakdownSkeleton />
        ) : (
          <>
            <CalorieSummary
              dailyAverage={average.calories}
              totalCalories={total.calories}
              caloriesTarget={target.calories}
              protein={average.protein}
              carbs={average.carbs}
              fats={average.fats}
            />
            <NutrientsList consumed={average} target={target} />
          </>
        )}
      </View>

      <AdherenceCalendar
        visible={isCalendarVisible}
        selectedDate={selectedDate}
        onClose={() => setIsCalendarVisible(false)}
        onSelectDate={handleSelectDate}
      />
    </View>
  );
}
