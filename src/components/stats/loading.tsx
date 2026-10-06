import { View } from "react-native";
import WeightCardSkeleton from "./weight-card/loading";
import WeightChartSkeleton from "./weight-chart/loading";

export default function GoalProgressSkeleton() {
  return (
    <View className="gap-3">
      <WeightCardSkeleton />
      <WeightCardSkeleton />
      <WeightChartSkeleton />
    </View>
  );
}
