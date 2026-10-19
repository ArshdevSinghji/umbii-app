import { CircularProgress } from "@/components/ui/circular-progress";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { Check } from "phosphor-react-native/src/icons/Check";
import { useEffect, useState } from "react";
import { View } from "react-native";
import OnboardingFooter from "../onboarding-footer";

const STEPS = [
  "Working out your base metabolism",
  "Adding your training and daily activity",
  "Setting your calorie target",
  "Balancing protein, carbs and fat",
];

// Counts up to 90% while the plan is being saved and generated, then the
// rest once it's done, so the ring never claims "100%" early.
const WAITING_CAP = 90;
const TICK_MS = 30;

interface IProps {
  firstName?: string;
  // The plan has been saved and the target came back.
  isDone: boolean;
  onSeePlan: () => void;
}

// While "Build my plan" runs: a ring counting up and four steps that tick
// off as it passes them. "See my plan" works once it's done and at 100%.
export default function BuildingStep({ firstName, isDone, onSeePlan }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const [percent, setPercent] = useState(0);

  const cap = isDone ? 100 : WAITING_CAP;

  useEffect(() => {
    if (percent >= cap) return;
    const timer = setTimeout(() => setPercent((value) => value + 1), TICK_MS);
    return () => clearTimeout(timer);
  }, [percent, cap]);

  const isComplete = percent >= 100;

  return (
    <View className="flex-1 justify-between">
      <View className="flex-1 items-center justify-center gap-8">
        <CircularProgress
          value={percent}
          max={100}
          size={150}
          strokeWidth={10}
          trackStrokeWidth={10}
          arcAngle={360}
          color={theme.foreground}
        >
          <Text className="font-sans-bold text-3xl">{`${percent}%`}</Text>
        </CircularProgress>

        <View className="items-center gap-1">
          <Text className="text-center font-sans-bold text-2xl">
            {firstName
              ? `Building your plan, ${firstName}`
              : "Building your plan"}
          </Text>
          <Text className="text-sm text-muted-foreground">
            This only takes a moment.
          </Text>
        </View>

        <View className="w-full gap-3 rounded-2xl bg-card p-4">
          {STEPS.map((step, index) => {
            // Each step ticks as the ring passes its quarter.
            const isChecked = percent >= ((index + 1) / STEPS.length) * 100;
            return (
              <View key={step} className="flex-row items-center gap-3">
                <View
                  className={cn(
                    "size-5 items-center justify-center rounded-full border",
                    isChecked
                      ? "border-foreground bg-foreground"
                      : "border-border",
                  )}
                >
                  {isChecked && (
                    <Check size={12} weight="bold" color={theme.background} />
                  )}
                </View>
                <Text
                  className={cn(
                    "flex-1 text-sm",
                    !isChecked && "text-muted-foreground",
                  )}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <OnboardingFooter
        label="See my plan"
        onPress={onSeePlan}
        disabled={!isComplete}
      />
    </View>
  );
}
