import ChoiceCard from "@/components/onboarding/choice-card";
import { GoalType, Pace } from "@/components/onboarding/onboarding.types";
import { getWeeklyRate } from "@/components/onboarding/onboarding.utils";
import { View } from "react-native";

interface IProps {
  goalType: Exclude<GoalType, GoalType.Maintenance>;
  value: Pace | null;
  onChange: (pace: Pace) => void;
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

// Same labels for losing and gaining; the rates differ.
export default function PacePicker({ goalType, value, onChange }: IProps) {
  return (
    <View className="gap-2">
      {PACES.map((option) => (
        <ChoiceCard
          key={option.value}
          title={`${option.label} (about ${getWeeklyRate(goalType, option.value)} kg/week)`}
          subtitle={option.subtitle}
          isSelected={option.value === value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}
