import { reportRequestError } from "@/lib/http-client";
import { parseLocalDateKey, toLocalDateKey } from "@/utils/date";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { useAppSelector } from "@/store/hooks";
import {
  StatsPeriod,
  getDateRangeForPeriod,
  getDaysInRange,
} from "@/utils/get-date-range-for-period";
import { useEffect, useState } from "react";
import { View } from "react-native";
import AdherenceCalendar from "./adherence-calendar";
import CalorieSummary, { getCalorieLabels } from "./calorie-summary";
import PeriodSelect from "./calorie-summary/period-select";
import BreakdownHeader from "./header";
import DailyBreakdownSkeleton from "./loading";
import NutrientsList from "./nutrients-list";

// Day a log belongs to, in local time. Date-only strings are already a day;
// timestamps are converted (toISOString would give the UTC day).
const toLogDateKey = (createdAt: string) =>
  createdAt.length === 10 ? createdAt : toLocalDateKey(new Date(createdAt));

export default function DailyBreakdown() {
  const [period, setPeriod] = useState<StatsPeriod>("day");
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateKey());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const { user } = useAppSelector((state) => state.userSlice);
  const {
    isPeriodFoodLogsLoading: isFoodLogsLoading,
    periodFoodLogs,
    fetchPeriodFoodLogs,
  } = useFoodLogsActionsHook();
  const {
    isLoading: isTargetLoading,
    nutritionTarget,
    fetchNutritionTarget,
  } = useNutritionTargetActionsHook();

  const referenceDate =
    period === "day" ? parseLocalDateKey(selectedDate) : new Date();
  const { startDate, endDate } = getDateRangeForPeriod(period, referenceDate);
  const days = getDaysInRange(startDate, endDate);

  useEffect(() => {
    if (!user.id) return;
    fetchNutritionTarget(
      user.id,
      period === "day" ? { date: selectedDate } : { startDate, endDate },
    ).catch((error) => reportRequestError("Error fetching target:", error));
  }, [user.id, period, selectedDate, startDate, endDate]);

  useEffect(() => {
    if (!user.id) return;
    fetchPeriodFoodLogs(user.id, { startDate, endDate }).catch((error) =>
      reportRequestError("Error fetching food logs:", error),
    );
  }, [user.id, startDate, endDate]);

  const isLoading = isFoodLogsLoading || isTargetLoading;

  const handlePeriodChange = (newPeriod: StatsPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod === "day") {
      setSelectedDate(toLocalDateKey());
    }
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setPeriod("day");
  };

  // Compare intake and target over the same covered days: the target range
  // starts at the user's first target (`startDate`), so earlier logs don't
  // count. Without a target, fall back to the whole requested period.
  const coveredStart = nutritionTarget?.startDate ?? startDate;
  const coveredDays = nutritionTarget?.targetDays || days;
  const coveredLogs = periodFoodLogs.filter(
    (log) => toLogDateKey(log.createdAt) >= coveredStart,
  );

  const total = calculateNutrition(coveredLogs.flatMap((log) => log.details));
  const average: NutritionValues = {
    calories: total.calories / coveredDays,
    protein: total.protein / coveredDays,
    carbs: total.carbs / coveredDays,
    fats: total.fats / coveredDays,
    fiber: total.fiber / coveredDays,
    sugar: total.sugar / coveredDays,
    sodium: total.sodium / coveredDays,
  };

  // Range targets are totals over the covered days (each day's own target,
  // so mid-period changes are included); dividing both sides by the same
  // `coveredDays` gives the same ratio as total vs total. A single day's
  // target (`date` query) has no targetDays and is divided by 1.
  const target: NutritionValues = {
    calories: (nutritionTarget?.calories ?? 0) / coveredDays,
    protein: (nutritionTarget?.protein ?? 0) / coveredDays,
    carbs: (nutritionTarget?.carbs ?? 0) / coveredDays,
    fats: (nutritionTarget?.fats ?? 0) / coveredDays,
    fiber: (nutritionTarget?.fiber ?? 0) / coveredDays,
    sugar: (nutritionTarget?.sugar ?? 0) / coveredDays,
    sodium: (nutritionTarget?.sodium ?? 0) / coveredDays,
  };

  // "Today's Calories" / "Calories · 12 Oct" for a day; "Avg. Daily
  // Calories" for week/month/year, where the number is a per-day average.
  const isToday = selectedDate === toLocalDateKey();
  const calorieLabels = getCalorieLabels(
    period === "day",
    isToday
      ? undefined
      : `Calories · ${parseLocalDateKey(selectedDate).toLocaleDateString(
          undefined,
          { day: "numeric", month: "short" },
        )}`,
  );

  const periodSelect = (
    <PeriodSelect value={period} onChange={handlePeriodChange} />
  );

  return (
    <View>
      <BreakdownHeader onCalendarPress={() => setIsCalendarVisible(true)} />
      <View className="gap-4">
        {isLoading ? (
          <DailyBreakdownSkeleton
            calorieAction={periodSelect}
            calorieTitle={calorieLabels.title}
          />
        ) : (
          <>
            <CalorieSummary
              title={calorieLabels.title}
              targetLabel={calorieLabels.targetLabel}
              dailyAverage={average.calories}
              caloriesTarget={target.calories}
              protein={average.protein}
              carbs={average.carbs}
              fats={average.fats}
              action={periodSelect}
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
