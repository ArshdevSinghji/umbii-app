import ChoiceChip from "@/components/onboarding/choice-chip";
import { View } from "react-native";

interface IProps {
  // Minutes.
  value: number | null;
  onChange: (minutes: number) => void;
}

// Each range is stored as one number of minutes: its midpoint, or a typical
// length at the open ends.
const SESSION_LENGTHS: { minutes: number; label: string }[] = [
  { minutes: 20, label: "Under 30" },
  { minutes: 38, label: "30-45" },
  { minutes: 53, label: "45-60" },
  { minutes: 75, label: "60-90" },
  { minutes: 100, label: "90+" },
];

export default function SessionLengthPicker({ value, onChange }: IProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {SESSION_LENGTHS.map(({ minutes, label }) => (
        <ChoiceChip
          key={minutes}
          label={label}
          isSelected={minutes === value}
          onPress={() => onChange(minutes)}
        />
      ))}
    </View>
  );
}
