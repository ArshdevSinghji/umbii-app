import { reportRequestError } from "@/lib/http-client";
import { toLocalDateKey } from "@/utils/date";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";
import { calculateNutrition } from "@/features/food-logs/food-logs.utils";
import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { useAppSelector } from "@/store/hooks";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/floating-tab-bar";
import { StatsPeriod, getDaysInRange } from "@/utils/get-date-range-for-period";
import { useColorScheme } from "nativewind";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollView, View } from "react-native";
import { CalendarProvider } from "react-native-calendars";
import BreakdownCalendar, { KEEP_SELECTION_ON } from "./breakdown-calendar";
import {
  formatBreakdownRange,
  getAccountStartDate,
  getBreakdownRange,
} from "./breakdown-calendar/calendar.utils";
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
  // The day the calendar is showing; moves with its arrows and swipes.
  const [visibleDate, setVisibleDate] = useState(selectedDate);
  const { colorScheme } = useColorScheme();

  const { user } = useAppSelector((state) => state.userSlice);
  const {
    isPeriodFoodLogsLoading: isFoodLogsLoading,
    periodFoodLogs,
    fetchPeriodFoodLogs,
  } = useFoodLogsActionsHook();
  const {
    // Breakdown's own target state, so a week / month total never replaces
    // the daily target Home shows.
    isPeriodTargetLoading: isTargetLoading,
    periodNutritionTarget: nutritionTarget,
    fetchPeriodNutritionTarget,
  } = useNutritionTargetActionsHook();

  // The picked day, or its week / month / year (up to today).
  // Never before the account existed.
  const { startDate, endDate } = getBreakdownRange(
    period,
    selectedDate,
    getAccountStartDate(user.createdAt),
  );
  const days = getDaysInRange(startDate, endDate);

  // Tabs stay mounted, so a plain useEffect wouldn't reload when you come
  // back to Breakdown (e.g. after logging a meal). useFocusEffect runs on
  // every focus and when the period / day changes. Reloading the same period
  // updates in place; only a new period or day shows the skeleton.
  useFocusEffect(
    useCallback(() => {
      if (!user.id) return;
      fetchPeriodNutritionTarget(
        user.id,
        period === "day" ? { date: selectedDate } : { startDate, endDate },
      ).catch((error) => reportRequestError("Error fetching target:", error));
      fetchPeriodFoodLogs(user.id, { startDate, endDate }).catch((error) =>
        reportRequestError("Error fetching food logs:", error),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id, period, selectedDate, startDate, endDate]),
  );

  const isLoading = isFoodLogsLoading || isTargetLoading;

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

  // "Today's Calories" / "Calories · 12 Oct" for a day; "Avg. Daily ·
  // 6 – 12 Oct" for week/month/year, where the number is a per-day average.
  const isToday = selectedDate === toLocalDateKey();
  const rangeLabel = formatBreakdownRange(period, startDate, endDate);
  const calorieLabels = getCalorieLabels(
    period === "day",
    period === "day"
      ? isToday
        ? "Today's Calories"
        : `Calories · ${rangeLabel}`
      : `Avg. Daily · ${rangeLabel}`,
  );

  // Picking a day keeps the period: the week / month / year moves with it.
  const periodSelect = <PeriodSelect value={period} onChange={setPeriod} />;

  return (
    <View className="flex-1">
      {/* Remount on theme change: the calendar reads its colours once. */}
      <CalendarProvider
        key={colorScheme}
        date={selectedDate}
        disableAutoDaySelection={KEEP_SELECTION_ON}
        onDateChanged={(date) => setVisibleDate(date)}
      >
        <View className="px-4 pt-8">
          <BreakdownHeader action={periodSelect} />
        </View>
        {/* Its drag handle strip is drawn as the rounded top of the card
            below, so the content looks like a sheet over the calendar. */}
        <BreakdownCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          range={period === "day" ? null : { startDate, endDate }}
          visibleDate={visibleDate}
        />

        <ScrollView
          className="flex-1 bg-card"
          // One section on the page, not separate cards: calories, then the
          // health score and nutrients.
          contentContainerStyle={{
            gap: 12,
            paddingTop: 8,
            paddingHorizontal: 16,
            paddingBottom: FLOATING_TAB_BAR_CLEARANCE,
          }}
        >
          {isLoading ? (
            <DailyBreakdownSkeleton calorieTitle={calorieLabels.title} />
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
              />
              <Separator />
              <NutrientsList consumed={average} target={target} />
            </>
          )}
        </ScrollView>
      </CalendarProvider>
    </View>
  );
}
