import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import {
  IWeightJournal,
  LoadStatus,
} from "@/features/weight-journals/weight-journals.types";
import {
  buildWeightChartPoints,
  getPeriodProgress,
  getWeightPeriodRange,
} from "@/features/weight-journals/weight-journals.utils";
import { View } from "react-native";
import WeightLineChart from "./line-chart";

const CHART_HEIGHT = "h-[180px]";

interface IProps {
  // This week's entries — loaded separately from the rest of the page.
  entries: IWeightJournal[];
  status: LoadStatus;
  onRetry: () => void;
  // All-time latest entry: carries weight into a week with no weigh-ins.
  latest: IWeightJournal;
}

// Loads on its own: the rest of the page shows as soon as the latest entry
// is in; this card fills in (or fails and retries) independently.
export default function WeightChart({
  entries,
  status,
  onRetry,
  latest,
}: IProps) {
  const { startDate, endDate } = getWeightPeriodRange("week");
  const isReady = status === "ready";

  const renderProgress = () => {
    if (!isReady) {
      return (
        <View className="h-8 justify-center">
          <Skeleton className="h-7 w-28 rounded-md" />
        </View>
      );
    }

    const progress = getPeriodProgress(entries, latest, startDate);
    return (
      <Text className="font-sans-bold text-2xl">
        {progress.toFixed(0)}%
        <Text className="text-sm text-muted-foreground">
          {"  "}toward your goal this week
        </Text>
      </Text>
    );
  };

  const renderChart = () => {
    if (status === "error") {
      return (
        <View className={`${CHART_HEIGHT} items-center justify-center gap-3`}>
          <Text className="text-sm text-muted-foreground">
            {"Couldn't load this week's chart"}
          </Text>
          <Button variant="outline" className="rounded-full" onPress={onRetry}>
            <Text>Try again</Text>
          </Button>
        </View>
      );
    }

    if (!isReady) {
      return <Skeleton className={`${CHART_HEIGHT} w-full rounded-xl`} />;
    }

    const points = buildWeightChartPoints(
      entries,
      "week",
      startDate,
      endDate,
      latest,
    );
    return <WeightLineChart key={entries.length} points={points} unit="kg" />;
  };

  return (
    <Card className="gap-4 px-4 py-4">
      <View className="gap-0.5">
        <Text className="font-sans-bold text-lg">Weight Progress</Text>
        {renderProgress()}
      </View>
      {renderChart()}
    </Card>
  );
}
