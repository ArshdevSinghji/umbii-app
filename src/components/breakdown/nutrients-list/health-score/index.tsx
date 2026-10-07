import { CircularProgress } from "@/components/ui/circular-progress";
import { Text } from "@/components/ui/text";
import {
  HEALTH_SCORE_MAX,
  getHealthScoreLabel,
} from "@/utils/calculate-health-score";
import { View } from "react-native";

export const HEALTH_SCORE_RING_SIZE = 56;
// Tailwind green-500, the same green as the on-target dots in each row.
const GOOD_COLOR = "#22C55E";

interface IProps {
  // null when nothing has been logged yet.
  score: number | null;
}

export default function HealthScore({ score }: IProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="gap-0.5">
        <Text className="text-sm text-muted-foreground">Health Score</Text>
        <Text className="text-xl font-sans-bold">
          {score === null ? "No meals yet" : getHealthScoreLabel(score)}
        </Text>
      </View>

      <CircularProgress
        value={score ?? 0}
        max={HEALTH_SCORE_MAX}
        color={GOOD_COLOR}
        size={HEALTH_SCORE_RING_SIZE}
        strokeWidth={8}
        arcAngle={360}
      >
        <Text className="text-sm font-sans-bold">
          {score ?? "–"}/{HEALTH_SCORE_MAX}
        </Text>
      </CircularProgress>
    </View>
  );
}
