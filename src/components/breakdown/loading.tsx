import { Separator } from "@/components/ui/separator";
import { View } from "react-native";
import CalorieSummarySkeleton from "./calorie-summary/loading";
import NutrientsListSkeleton from "./nutrients-list/loading";

interface IProps {
  calorieTitle: string;
}

export default function DailyBreakdownSkeleton({ calorieTitle }: IProps) {
  return (
    <View className="gap-3">
      <CalorieSummarySkeleton title={calorieTitle} />
      <Separator />
      <NutrientsListSkeleton />
    </View>
  );
}
