import MeasurementField from "@/components/health-details/measurement-field";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import ChoiceCard from "../choice-card";
import { GoalType, Pace } from "../onboarding.types";
import { getTargetWeightRange, getWeeklyRate } from "../onboarding.utils";

interface IProps {
  goalType: Exclude<GoalType, GoalType.Maintenance>;
  weightKg: number;
  targetWeightKg: number;
  pace: Pace | null;
  onTargetWeightChange: (kg: number) => void;
  onPaceChange: (pace: Pace) => void;
}

const PACES: { value: Pace; label: string; subtitle: string }[] = [
  { value: Pace.Slow, label: "Slow", subtitle: "Easiest to stick to" },
  {
    value: Pace.Moderate,
    label: "Moderate",
    subtitle: "A steady middle ground",
  },
  {
    value: Pace.Aggressive,
    label: "Aggressive",
    subtitle: "Faster, but harder to keep up",
  },
];

// Target weight on the ruler, then how fast to get there. Same labels for
// losing and gaining; the rates differ.
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
        range={getTargetWeightRange(weightKg)}
        value={targetWeightKg}
        onChange={onTargetWeightChange}
      />

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Pace</Text>
        {PACES.map(({ value, label, subtitle }) => (
          <ChoiceCard
            key={value}
            title={`${label} (about ${getWeeklyRate(goalType, value)} kg/week)`}
            subtitle={subtitle}
            isSelected={value === pace}
            onPress={() => onPaceChange(value)}
          />
        ))}
      </View>
    </View>
  );
}
