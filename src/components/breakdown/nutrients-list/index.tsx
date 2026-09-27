import { Card } from "@/components/ui/card";
import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { THEME } from "@/lib/theme";
import { Activity, Candy, Salad, Wheat } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import NutrientRow from "./nutrient-row";

interface IProps {
  consumed: NutritionValues;
  target: NutritionValues;
}

export default function NutrientsList({ consumed, target }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const netCarbs = Math.max(0, consumed.carbs - consumed.fiber);
  const netCarbsTarget = Math.max(0, target.carbs - target.fiber);

  const nutrients = [
    {
      key: "fiber",
      label: "Fiber",
      value: consumed.fiber,
      target: target.fiber,
      unit: "g",
      isGood: consumed.fiber >= target.fiber,
      icon: <Salad size={16} color={theme.foreground} />,
    },
    {
      key: "net-carbs",
      label: "Net Carbs",
      value: netCarbs,
      target: netCarbsTarget,
      unit: "g",
      isGood: netCarbs <= netCarbsTarget || netCarbsTarget === 0,
      icon: <Wheat size={16} color={theme.foreground} />,
    },
    {
      key: "sugar",
      label: "Sugar",
      value: consumed.sugar,
      target: target.sugar,
      unit: "g",
      isGood: consumed.sugar <= target.sugar || target.sugar === 0,
      icon: <Candy size={16} color={theme.foreground} />,
    },
    {
      key: "sodium",
      label: "Sodium",
      value: consumed.sodium,
      target: target.sodium,
      unit: "mg",
      isGood: consumed.sodium <= target.sodium || target.sodium === 0,
      icon: <Activity size={16} color={theme.foreground} />,
    },
  ];

  return (
    <Card className="gap-2 py-4 px-4">
      {nutrients.map(({ key, ...nutrient }) => (
        <NutrientRow key={key} {...nutrient} />
      ))}
    </Card>
  );
}
