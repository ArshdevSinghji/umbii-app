import ChoiceChip from "@/components/onboarding/choice-chip";
import { DietType } from "@/features/user/user.types";
import { View } from "react-native";

interface IProps {
  value: DietType | null;
  onChange: (dietType: DietType) => void;
}

const DIET_TYPES: { value: DietType; label: string }[] = [
  { value: DietType.Vegetarian, label: "Vegetarian" },
  { value: DietType.Eggetarian, label: "Eggetarian" },
  { value: DietType.NonVeg, label: "Non-veg" },
  { value: DietType.Vegan, label: "Vegan" },
  { value: DietType.Jain, label: "Jain" },
  { value: DietType.Halal, label: "Halal" },
];

export default function DietPicker({ value, onChange }: IProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {DIET_TYPES.map((option) => (
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
