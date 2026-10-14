import { reportRequestError } from "@/lib/http-client";
import { toLocalDateKey } from "@/utils/date";
import { useAppSelector } from "@/store/hooks";
import { View } from "react-native";
import HomeDashboardHeader from "./header";
import TodaysGoal from "./todays-goal";
import TodaysMeals from "./todays-meals";
import WeekDays from "./week-days";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";

export default function HomeDashboard() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { fetchFoodLogs } = useFoodLogsActionsHook();

  const [date, setDate] = useState(() => toLocalDateKey());

  const handleDatePress = (selectedDate: string) => setDate(selectedDate);

  // Tabs stay mounted, so a plain useEffect wouldn't run again when you come
  // back to Home (e.g. after logging a meal on Log Food). useFocusEffect runs
  // on every focus, and again when the selected day changes.
  useFocusEffect(
    useCallback(() => {
      if (!user.id) return;
      fetchFoodLogs(user.id, { date }).catch((error) =>
        reportRequestError("Error fetching food logs:", error),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id, date]),
  );

  return (
    <View>
      <HomeDashboardHeader />
      <WeekDays date={date} handleDatePress={handleDatePress} />
      <TodaysGoal />
      <TodaysMeals />
    </View>
  );
}
