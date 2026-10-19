import { CircularProgress } from "@/components/ui/circular-progress";
import { Text } from "@/components/ui/text";
import { IGeneratedNutritionTarget } from "@/features/nutrition-target/nutrition-target.types";
import { GoalType } from "@/features/user/user.types";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Fire } from "phosphor-react-native/src/icons/Fire";
import { Info } from "phosphor-react-native/src/icons/Info";
import { ScrollView, View } from "react-native";
import OnboardingFooter from "../onboarding-footer";

const CALORIE_COLOR = "#FF5A00";

interface IProps {
  target: IGeneratedNutritionTarget;
  onContinue: () => void;
}

const formatNumber = (value: number) => Math.round(value).toLocaleString();

// After "See my plan": the generated targets and how they were worked out.
// "Start tracking" acknowledges them and goes Home. (Editing comes later.)
export default function PlanResult({ target, onContinue }: IProps) {
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

  // Calories from training and the rest of the day, on top of resting.
  const activityKcal = target.maintenanceCalories - target.bmr;
  // The goal's adjustment: negative is a deficit.
  const goalKcal = target.calories - target.maintenanceCalories;
  const proteinPerKg =
    target.weightKg > 0 ? target.protein / target.weightKg : 0;

  return (
    <View className="flex-1 gap-4">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <Text className="text-sm text-muted-foreground">
            Your plan is ready
          </Text>
          <Text className="font-sans-bold text-3xl">
            Here are your daily targets
          </Text>
        </View>

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
          <Extra
            label="Sugar"
            value={`under ${formatNumber(target.sugar)} g`}
          />
          <Extra
            label="Sodium"
            value={`under ${formatNumber(target.sodium)} mg`}
          />
        </View>

        {/* How the calories were worked out. */}
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

        {/* Safety rules that changed the plan, in the backend's words. */}
        {target.notes.map((note) => (
          <Note key={note} icon={<Info size={18} color={theme.chart4} />}>
            {note}
          </Note>
        ))}
      </ScrollView>

      <View className="gap-3">
        <OnboardingFooter label="Start tracking" onPress={onContinue} />
        <Text className="text-center text-xs text-muted-foreground">
          As your weight changes, recalculate your plan anytime in Profile.
        </Text>
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

function Note({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-border p-4">
      {icon}
      <Text className="flex-1 text-sm">{children}</Text>
    </View>
  );
}
