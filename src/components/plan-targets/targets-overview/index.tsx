import { CircularProgress } from "@/components/ui/circular-progress";
import { Text } from "@/components/ui/text";
import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Fire } from "phosphor-react-native/src/icons/Fire";
import { View } from "react-native";

const CALORIE_COLOR = "#FF5A00";

export const formatNumber = (value: number) =>
  Math.round(value).toLocaleString();

interface IProps {
  target: NutritionValues;
}

// Daily calories, then protein / carbs / fat with each one's share of the
// calories, then fiber and the sugar and sodium limits. Shared by the
// onboarding result and the Your plan page.
export default function TargetsOverview({ target }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  // Share of calories: 4 kcal per gram of protein and carbs, 9 per gram of
  // fat.
  const shareOf = (kcal: number) =>
    target.calories > 0 ? Math.round((kcal / target.calories) * 100) : 0;
  const macros = [
    {
      label: "Protein",
      grams: target.protein,
      share: shareOf(target.protein * 4),
      color: theme.chart1,
    },
    {
      label: "Carbs",
      grams: target.carbs,
      share: shareOf(target.carbs * 4),
      color: theme.chart2,
    },
    {
      label: "Fat",
      grams: target.fats,
      share: shareOf(target.fats * 9),
      color: theme.chart4,
    },
  ];

  return (
    <View className="gap-3">
      <View className="gap-4 rounded-2xl bg-card p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-muted-foreground">
              Daily calories
            </Text>
            <Text className="font-sans-bold text-3xl">
              {formatNumber(target.calories)}
              <Text className="text-sm text-muted-foreground">{" kcal"}</Text>
            </Text>
          </View>
          <CircularProgress
            value={75}
            max={100}
            size={56}
            strokeWidth={6}
            trackStrokeWidth={6}
            color={CALORIE_COLOR}
          >
            <Fire size={18} color={CALORIE_COLOR} weight="fill" />
          </CircularProgress>
        </View>

        <View className="flex-row gap-2">
          {macros.map(({ label, grams, share, color }) => (
            <View
              key={label}
              className="flex-1 items-center gap-2 rounded-2xl bg-background p-3"
            >
              <View className="items-center">
                <Text className="font-sans-bold text-base">
                  {`${formatNumber(grams)}g`}
                </Text>
                <Text className="text-xs text-muted-foreground">{label}</Text>
              </View>
              <CircularProgress
                value={share}
                max={100}
                size={40}
                strokeWidth={5}
                trackStrokeWidth={5}
                color={color}
              />
              <Text className="text-[10px] text-muted-foreground">
                {`${share}% of kcal`}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="flex-row gap-2">
        <Extra label="Fiber" value={`${formatNumber(target.fiber)} g`} />
        <Extra label="Sugar" value={`under ${formatNumber(target.sugar)} g`} />
        <Extra
          label="Sodium"
          value={`under ${formatNumber(target.sodium)} mg`}
        />
      </View>
    </View>
  );
}

function Extra({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 gap-0.5 rounded-2xl bg-card p-3">
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className="font-sans-bold text-sm">{value}</Text>
    </View>
  );
}
