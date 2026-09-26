import { useAppSelector } from "@/store/hooks";
import { View } from "react-native";
import HomeDashboardHeader from "./header";
import TodaysGoal from "./todays-goal";
import TodaysMeals from "./todays-meals";
import WeekDays from "./week-days";
import { useEffect, useState } from "react";
import { useFoodLogsActionsHook } from "@/features/food-logs/food-logs.hooks";

export default function HomeDashboard() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { fetchFoodLogs } = useFoodLogsActionsHook();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleDatePress = (selectedDate: string) => setDate(selectedDate);

  useEffect(() => { fetchFoodLogs(user.id, date) }, [user.id, date]);

  return (
    <View>
      <HomeDashboardHeader />
      <WeekDays date={date} handleDatePress={handleDatePress}/>
      <TodaysGoal />
      <TodaysMeals />
    </View>
  );
}
