import { Separator } from "@/components/ui/separator";
import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { THEME } from "@/lib/theme";
import {
  NutrientGoal,
  calculateHealthScore,
  scoreNutrient,
} from "@/utils/calculate-health-score";
import { Cookie } from "phosphor-react-native/src/icons/Cookie";
import { Grains } from "phosphor-react-native/src/icons/Grains";
import { Leaf } from "phosphor-react-native/src/icons/Leaf";
import { Pulse } from "phosphor-react-native/src/icons/Pulse";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import HealthScore from "./health-score";
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

  const nutrients: {
    key: string;
    label: string;
    value: number;
    target: number;
    unit: string;
    goal: NutrientGoal;
    icon: React.ReactNode;
  }[] = [
    {
      key: "fiber",
      label: "Fiber",
      value: consumed.fiber,
      target: target.fiber,
      unit: "g",
      goal: "min",
      icon: <Leaf size={16} color={theme.foreground} />,
    },
    {
      key: "net-carbs",
      label: "Net Carbs",
      value: netCarbs,
      target: netCarbsTarget,
      unit: "g",
      goal: "max",
      icon: <Grains size={16} color={theme.foreground} />,
    },
    {
      key: "sugar",
      label: "Sugar",
      value: consumed.sugar,
      target: target.sugar,
      unit: "g",
      goal: "max",
      icon: <Cookie size={16} color={theme.foreground} />,
    },
    {
      key: "sodium",
      label: "Sodium",
      value: consumed.sodium,
      target: target.sodium,
      unit: "mg",
      goal: "max",
      icon: <Pulse size={16} color={theme.foreground} />,
    },
  ];

  // Nothing logged → no score, rather than a misleading one.
  const score = consumed.calories > 0 ? calculateHealthScore(nutrients) : null;

  return (
    <View className="gap-1">
      <HealthScore score={score} />
      <Separator className="my-1.5" />
      {nutrients.map(({ key, label, value, unit, icon, ...rest }) => (
        <NutrientRow
          key={key}
          label={label}
          value={value}
          unit={unit}
          icon={icon}
          // On target = full credit for this nutrient.
          isGood={scoreNutrient({ value, ...rest }) === 1}
        />
      ))}
    </View>
  );
}
