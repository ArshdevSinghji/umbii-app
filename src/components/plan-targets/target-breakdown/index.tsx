import { Text } from "@/components/ui/text";
import { IGeneratedNutritionTarget } from "@/features/nutrition-target/nutrition-target.types";
import { GoalType } from "@/features/user/user.types";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Info } from "phosphor-react-native/src/icons/Info";
import { View } from "react-native";
import { formatNumber } from "../targets-overview";

interface IProps {
  target: IGeneratedNutritionTarget;
}

// How the calories were worked out (resting burn, activity, the goal's
// adjustment, protein per kg), then any safety rules that changed the plan,
// in the backend's words. Only a generated target carries these.
export default function TargetBreakdown({ target }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  // Calories from training and the rest of the day, on top of resting.
  const activityKcal = target.maintenanceCalories - target.bmr;
  // The goal's adjustment: negative is a deficit.
  const goalKcal = target.calories - target.maintenanceCalories;
  const proteinPerKg =
    target.weightKg > 0 ? target.protein / target.weightKg : 0;

  return (
    <View className="gap-3">
      <View className="gap-3 rounded-2xl bg-card p-4">
        <BreakdownRow
          label="Base metabolism"
          value={`${formatNumber(target.bmr)} kcal`}
        />
        <BreakdownRow
          label="Training and daily activity"
          value={`+ ${formatNumber(activityKcal)} kcal`}
        />
        {Math.round(goalKcal) !== 0 && (
          <BreakdownRow
            label={
              goalKcal < 0
                ? "Calorie deficit"
                : target.goal === GoalType.Hypertrophy
                  ? "Lean muscle gain"
                  : "Calorie surplus"
            }
            value={`${goalKcal < 0 ? "-" : "+"} ${formatNumber(Math.abs(goalKcal))} kcal`}
            color={goalKcal < 0 ? theme.chart1 : theme.chart2}
          />
        )}
        <BreakdownRow
          label="Protein"
          value={`${proteinPerKg.toFixed(1)} g per kg of body weight`}
        />
      </View>

      {(target.notes ?? []).map((note) => (
        <View
          key={note}
          className="flex-row items-center gap-3 rounded-2xl border border-border p-4"
        >
          <Info size={18} color={theme.chart4} />
          <Text className="flex-1 text-sm">{note}</Text>
        </View>
      ))}
    </View>
  );
}

function BreakdownRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text className="flex-1 text-sm text-muted-foreground">{label}</Text>
      <Text
        className="font-sans-bold text-sm"
        style={color ? { color } : undefined}
      >
        {value}
      </Text>
    </View>
  );
}
