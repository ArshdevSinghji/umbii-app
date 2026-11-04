import DietPicker from "@/components/profile-fields/diet-picker";
import HealthFlagsPicker from "@/components/profile-fields/health-flags-picker";
import { toggleChoice } from "@/components/profile-fields/profile-fields.utils";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
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

const ALLERGIES = [
  { value: Allergy.Lactose, label: "Lactose" },
  { value: Allergy.Gluten, label: "Gluten" },
  { value: Allergy.Nuts, label: "Nuts" },
  { value: Allergy.Soy, label: "Soy" },
  { value: Allergy.Eggs, label: "Eggs" },
  { value: Allergy.Shellfish, label: "Shellfish" },
];

// Diet type, allergies and health conditions. The last step.
export default function FoodStep({
  dietType,
  allergies,
  healthFlags,
  onDietTypeChange,
  onAllergiesChange,
  onHealthFlagsChange,
}: IProps) {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Diet type</Text>
        <DietPicker value={dietType} onChange={onDietTypeChange} />
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
              onPress={() => onAllergiesChange(toggleChoice(allergies, value))}
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
        <HealthFlagsPicker value={healthFlags} onChange={onHealthFlagsChange} />
      </View>
    </View>
  );
}
