import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { calculateBmi, getBmiCategory } from "@/utils/calculate-bmi";
import { Pencil } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { useBmiColors } from "../hooks/use-bmi-colors";
import BmiLegend from "./bmi-legend";
import BmiScale from "./bmi-scale";

interface IProps {
  weight: number;
  height: number | null;
  onUpdateHeight: () => void;
}

export default function BmiCard({ weight, height, onUpdateHeight }: IProps) {
  const getColor = useBmiColors();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  if (!height) {
    return (
      <Card className="gap-3 px-4 py-4 rounded-2xl border-0">
        <Text className="font-sans-bold text-lg">Your BMI</Text>
        <Text className="text-sm text-muted-foreground">
          Add your height to see your Body Mass Index.
        </Text>
        <Button className="self-start rounded-full" onPress={onUpdateHeight}>
          <Text>Add height</Text>
        </Button>
      </Card>
    );
  }

  const bmi = calculateBmi(weight, height);
  const category = getBmiCategory(bmi);
  const color = getColor(category.label);

  return (
    <Card className="gap-4 px-4 py-4 rounded-2xl border-0">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-bold text-lg">Your BMI</Text>
        <Pressable
          onPress={onUpdateHeight}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Edit height"
          className="flex-row items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 active:opacity-70"
        >
          <Text className="text-xs text-muted-foreground">Height</Text>
          <Text className="text-xs font-sans-bold">
            {Number(height.toFixed(1))} cm
          </Text>
          <Pencil size={12} color={theme.foreground} />
        </Pressable>
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="font-sans-bold text-2xl">{bmi.toFixed(1)}</Text>
        <Text className="text-sm text-muted-foreground">Your weight is</Text>
        <View className="overflow-hidden rounded-full px-3 py-0.5">
          <View
            className="absolute inset-0"
            style={{ backgroundColor: color, opacity: 0.15 }}
          />
          <Text className="text-xs font-sans-bold" style={{ color }}>
            {category.label}
          </Text>
        </View>
      </View>

      <BmiScale bmi={bmi} />
      <BmiLegend />
    </Card>
  );
}
