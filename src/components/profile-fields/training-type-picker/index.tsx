import ChoiceChip from "@/components/onboarding/choice-chip";
import { TrainingType } from "@/features/user/user.types";
import { View } from "react-native";

interface IProps {
  value: TrainingType | null;
  onChange: (trainingType: TrainingType) => void;
}

const TRAINING_TYPES: { value: TrainingType; label: string }[] = [
  { value: TrainingType.Lifting, label: "Lifting" },
  { value: TrainingType.Cardio, label: "Cardio" },
  { value: TrainingType.Mixed, label: "Mixed" },
  { value: TrainingType.Sport, label: "Sport/other" },
];

export default function TrainingTypePicker({ value, onChange }: IProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {TRAINING_TYPES.map((option) => (
        <ChoiceChip
          key={option.value}
          label={option.label}
          isSelected={option.value === value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}
