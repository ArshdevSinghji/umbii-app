import { View } from "react-native";
import HomeDashboardHeader from "./components/header";
import TodaysGoal from "./components/todays-goal";
import WeekDays from "./components/week-days";
import TodaysMeals from "./components/todays-meals";

export default function HomeDashboard() {
  return (
    <View>
      <HomeDashboardHeader />
      <WeekDays />
      <TodaysGoal />
      <TodaysMeals />
    </View>
  );
}
