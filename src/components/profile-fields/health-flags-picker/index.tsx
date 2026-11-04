import ChoiceCard from "@/components/onboarding/choice-card";
import { Text } from "@/components/ui/text";
import { HealthFlag } from "@/features/user/user.types";
import { View } from "react-native";
import { toggleChoice } from "../profile-fields.utils";

interface IProps {
  // `[]` is "None of these", `null` is unanswered.
  value: HealthFlag[] | null;
  onChange: (healthFlags: HealthFlag[] | null) => void;
}

const HEALTH_FLAGS = [
  {
    value: HealthFlag.PregnantOrBreastfeeding,
    label: "Pregnant or breastfeeding",
  },
  { value: HealthFlag.Diabetes, label: "Diabetes" },
  { value: HealthFlag.KidneyDisease, label: "Kidney disease" },
  { value: HealthFlag.HighBloodPressure, label: "High blood pressure" },
  {
    value: HealthFlag.EatingDisorderHistory,
    label: "History of an eating disorder",
  },
];

export default function HealthFlagsPicker({ value, onChange }: IProps) {
  const hasFlags = (value ?? []).length > 0;

  return (
    <View className="gap-2">
      {HEALTH_FLAGS.map((option) => (
        <ChoiceCard
          key={option.value}
          title={option.label}
          multiple
          isSelected={(value ?? []).includes(option.value)}
          onPress={() => onChange(toggleChoice(value, option.value))}
        />
      ))}
      <ChoiceCard
        title="None of these"
        multiple
        isSelected={value !== null && value.length === 0}
        onPress={() => onChange([])}
      />
      {hasFlags && (
        <Text className="text-xs text-muted-foreground">
          {
            "We'll keep your targets conservative. Please check with a doctor too."
          }
        </Text>
      )}
    </View>
  );
}
