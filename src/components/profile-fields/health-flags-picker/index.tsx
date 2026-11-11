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

// Each subtitle is what the server's target calculator does for that flag,
// so people see why their numbers differ. Keep in sync with the backend.
const HEALTH_FLAGS = [
  {
    value: HealthFlag.PregnantOrBreastfeeding,
    label: "Pregnant or breastfeeding",
    effect: "No calorie deficit: a fat-loss goal becomes maintenance.",
  },
  {
    value: HealthFlag.Diabetes,
    label: "Diabetes",
    effect:
      "Carbs capped at 45% of calories (the rest moves to fat), and a lower sugar limit.",
  },
  {
    value: HealthFlag.KidneyDisease,
    label: "Kidney disease",
    effect: "Protein capped at 0.8 g per kg of body weight, sodium at 1500 mg.",
  },
  {
    value: HealthFlag.HighBloodPressure,
    label: "High blood pressure",
    effect: "Sodium capped at 1500 mg a day.",
  },
  {
    value: HealthFlag.EatingDisorderHistory,
    label: "History of an eating disorder",
    effect: "No calorie deficit: a fat-loss goal becomes maintenance.",
  },
];

export default function HealthFlagsPicker({ value, onChange }: IProps) {
  const hasFlags = (value ?? []).length > 0;

  return (
    <View className="gap-2">
      <Text className="text-xs text-muted-foreground">
        Picking any of these also holds your weekly loss or gain to the slowest
        pace.
      </Text>
      {HEALTH_FLAGS.map((option) => (
        <ChoiceCard
          key={option.value}
          title={option.label}
          subtitle={option.effect}
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
            "Please check your targets with a doctor too."
          }
        </Text>
      )}
    </View>
  );
}
