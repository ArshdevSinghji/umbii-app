import { View } from "react-native";
import BmiCardSkeleton from "./bmi-card/loading";
import WeightCardSkeleton from "./weight-card/loading";
import WeightChartSkeleton from "./weight-chart/loading";

interface IProps {
  hasHeight: boolean;
}

// Same cards, order and spacing as the loaded screen.
export default function GoalProgressSkeleton({ hasHeight }: IProps) {
  return (
    <View className="gap-3">
      <WeightCardSkeleton label="Goal weight" actionLabel="Update my goal" />
      <WeightCardSkeleton label="Current weight" actionLabel="Update weight" />
      <WeightChartSkeleton />
      <BmiCardSkeleton hasHeight={hasHeight} />
    </View>
  );
}
