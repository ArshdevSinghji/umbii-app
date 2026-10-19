import { Text } from "@/components/ui/text";
import { View } from "react-native";
import ChoiceCard from "../choice-card";
import ChoiceChip from "../choice-chip";
import { Allergy, DietType, HealthFlag } from "../onboarding.types";

interface IProps {
  dietType: DietType | null;
  allergies: Allergy[] | null;
  healthFlags: HealthFlag[] | null;
  onDietTypeChange: (dietType: DietType) => void;
  onAllergiesChange: (allergies: Allergy[] | null) => void;
  onHealthFlagsChange: (healthFlags: HealthFlag[] | null) => void;
}

const DIET_TYPES: { value: DietType; label: string }[] = [
  { value: DietType.Vegetarian, label: "Vegetarian" },
  { value: DietType.Eggetarian, label: "Eggetarian" },
  { value: DietType.NonVeg, label: "Non-veg" },
  { value: DietType.Vegan, label: "Vegan" },
  { value: DietType.Jain, label: "Jain" },
  { value: DietType.Halal, label: "Halal" },
];

const ALLERGIES = [
  { value: Allergy.Lactose, label: "Lactose" },
  { value: Allergy.Gluten, label: "Gluten" },
  { value: Allergy.Nuts, label: "Nuts" },
  { value: Allergy.Soy, label: "Soy" },
  { value: Allergy.Eggs, label: "Eggs" },
  { value: Allergy.Shellfish, label: "Shellfish" },
];

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

// Multi-select with a "None" option: `[]` is "None", `null` is unanswered.
// Picking None clears the rest; picking anything else clears None; taking
// the last one off leaves it unanswered again.
const toggle = <T extends string>(current: T[] | null, value: T) => {
  const selected = current ?? [];
  const next = selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
  return next.length > 0 ? next : null;
};

// Diet type, allergies and health conditions. The last step.
export default function FoodStep({
  dietType,
  allergies,
  healthFlags,
  onDietTypeChange,
  onAllergiesChange,
  onHealthFlagsChange,
}: IProps) {
  const hasHealthFlags = (healthFlags ?? []).length > 0;

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Diet type</Text>
        <View className="flex-row flex-wrap gap-2">
          {DIET_TYPES.map(({ value, label }) => (
            <ChoiceChip
              key={value}
              label={label}
              isSelected={value === dietType}
              onPress={() => onDietTypeChange(value)}
            />
          ))}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">
          Allergies or intolerances
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {ALLERGIES.map(({ value, label }) => (
            <ChoiceChip
              key={value}
              label={label}
              multiple
              isSelected={(allergies ?? []).includes(value)}
              onPress={() => onAllergiesChange(toggle(allergies, value))}
            />
          ))}
          <ChoiceChip
            label="None"
            multiple
            isSelected={allergies !== null && allergies.length === 0}
            onPress={() => onAllergiesChange([])}
          />
        </View>
      </View>

      <View className="gap-2">
        <View className="gap-0.5">
          <Text className="text-sm text-muted-foreground">Health</Text>
          <Text className="text-xs text-muted-foreground">
            This helps us keep your plan safe. Not shared.
          </Text>
        </View>
        {HEALTH_FLAGS.map(({ value, label }) => (
          <ChoiceCard
            key={value}
            title={label}
            multiple
            isSelected={(healthFlags ?? []).includes(value)}
            onPress={() => onHealthFlagsChange(toggle(healthFlags, value))}
          />
        ))}
        <ChoiceCard
          title="None of these"
          multiple
          isSelected={healthFlags !== null && healthFlags.length === 0}
          onPress={() => onHealthFlagsChange([])}
        />
        {hasHealthFlags && (
          <Text className="text-xs text-muted-foreground">
            {
              "We'll keep your targets conservative. Please check with a doctor too."
            }
          </Text>
        )}
      </View>
    </View>
  );
}
