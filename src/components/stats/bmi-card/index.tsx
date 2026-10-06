import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { calculateBmi, getBmiCategory } from "@/utils/calculate-bmi";
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
          className="rounded-full bg-muted px-3 py-1"
        >
          <Text className="text-xs font-sans-bold">{height} cm</Text>
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
