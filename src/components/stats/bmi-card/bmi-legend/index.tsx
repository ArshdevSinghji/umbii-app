import { Text } from "@/components/ui/text";
import { BMI_CATEGORIES } from "@/utils/calculate-bmi";
import { useBmiColors } from "../../hooks/use-bmi-colors";
import { View } from "react-native";

export default function BmiLegend() {
  const getColor = useBmiColors();

  return (
    <View className="flex-row flex-wrap justify-between gap-y-1">
      {BMI_CATEGORIES.map((category) => (
        <View key={category.label} className="flex-row items-center gap-1.5">
          <View
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: getColor(category.label) }}
          />
          <Text className="text-xs text-muted-foreground">
            {category.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
