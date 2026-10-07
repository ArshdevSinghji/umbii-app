import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { IWeightJournal } from "@/features/weight-journals/weight-journals.types";
import {
  buildWeightChartPoints,
  getOverallProgress,
  getProgressStatus,
  getWeightPeriodRange,
} from "@/features/weight-journals/weight-journals.utils";
import { View } from "react-native";
import WeightLineChart from "./line-chart";

interface IProps {
  journals: IWeightJournal[];
}

export default function WeightChart({ journals }: IProps) {
  const { startDate, endDate } = getWeightPeriodRange("week");
  const points = buildWeightChartPoints(journals, "week", startDate, endDate);
  const progress = getOverallProgress(journals);

  return (
    <Card className="gap-4 px-4 py-4">
      <View className="gap-0.5">
        <Text className="font-sans-bold text-lg">Weight Progress</Text>
        <Text className="font-sans-bold text-2xl">
          {progress.toFixed(0)}%
          <Text className="text-sm text-muted-foreground">
            {"  "}
            {getProgressStatus(progress)}
          </Text>
        </Text>
      </View>

      {points.some((point) => point.weight !== null) ? (
        <WeightLineChart key={journals.length} points={points} unit="kg" />
      ) : (
        <View className="h-[180px] items-center justify-center">
          <Text className="text-sm text-muted-foreground">
            No weight entries yet
          </Text>
        </View>
      )}
    </Card>
  );
}
