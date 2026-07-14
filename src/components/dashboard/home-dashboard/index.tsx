import { useAppSelector } from "@/store/hooks";
import { View } from "react-native";
import HomeDashboardHeader from "./components/header";
import TodaysGoal from "./components/todays-goal";
import TodaysMeals from "./components/todays-meals";
import WeekDays from "./components/week-days";
import { useEffect, useState } from "react";
import { useUserActionsHook } from "@/features/user/user.hook";

export default function HomeDashboard() {
  const { user } = useAppSelector((state) => state.userSlice);
  const { fetchFoodLogs } = useUserActionsHook();

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
