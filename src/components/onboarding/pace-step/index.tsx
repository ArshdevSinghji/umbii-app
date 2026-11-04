import MeasurementField from "@/components/health-details/measurement-field";
import PacePicker from "@/components/profile-fields/pace-picker";
import TargetMarginNote from "@/components/profile-fields/target-margin-note";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { GoalType, Pace } from "../onboarding.types";
import { getTargetWeightRange } from "../onboarding.utils";

interface IProps {
  goalType: Exclude<GoalType, GoalType.Maintenance>;
  weightKg: number;
  targetWeightKg: number;
  pace: Pace | null;
  onTargetWeightChange: (kg: number) => void;
  onPaceChange: (pace: Pace) => void;
}

// Target weight on the ruler, then how fast to get there.
export default function PaceStep({
  goalType,
  weightKg,
  targetWeightKg,
  pace,
  onTargetWeightChange,
  onPaceChange,
}: IProps) {
  return (
    <View className="gap-6">
      <MeasurementField
        label="Target weight"
        unit="kg"
        range={getTargetWeightRange(weightKg, goalType)}
        value={targetWeightKg}
        onChange={onTargetWeightChange}
      />
      <TargetMarginNote goalType={goalType} weightKg={weightKg} />

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Pace</Text>
        <PacePicker goalType={goalType} value={pace} onChange={onPaceChange} />
      </View>
    </View>
  );
}
