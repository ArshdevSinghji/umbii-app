import { View } from "react-native";
import CalorieSummarySkeleton from "./calorie-summary/loading";
import NutrientsListSkeleton from "./nutrients-list/loading";

export default function DailyBreakdownSkeleton() {
  return (
    <View className="gap-4">
      <CalorieSummarySkeleton />
      <NutrientsListSkeleton />
    </View>
  );
}
