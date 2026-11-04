import ChoiceChip from "@/components/onboarding/choice-chip";
import { View } from "react-native";

interface IProps {
  value: number | null;
  onChange: (workoutsPerWeek: number) => void;
}

const WORKOUT_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

// Workouts per week, 0 to 7, in one row.
export default function WorkoutsPicker({ value, onChange }: IProps) {
  return (
    <View className="flex-row gap-1.5">
      {WORKOUT_OPTIONS.map((count) => (
        <ChoiceChip
          key={count}
          label={String(count)}
          isSelected={count === value}
          onPress={() => onChange(count)}
          className="h-12 flex-1 px-0"
        />
      ))}
    </View>
  );
}
