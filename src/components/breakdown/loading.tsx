import { ReactNode } from "react";
import { View } from "react-native";
import CalorieSummarySkeleton from "./calorie-summary/loading";
import NutrientsListSkeleton from "./nutrients-list/loading";

interface IProps {
  // Passed through to the calorie card so the period dropdown stays put.
  calorieAction?: ReactNode;
}

export default function DailyBreakdownSkeleton({ calorieAction }: IProps) {
  return (
    <View className="gap-4">
      <CalorieSummarySkeleton action={calorieAction} />
      <NutrientsListSkeleton />
    </View>
  );
}
