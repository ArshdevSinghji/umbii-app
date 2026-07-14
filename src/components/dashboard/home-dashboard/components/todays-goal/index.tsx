import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useUserActionsHook } from "@/features/user/user.hook";
import { calculateNutrition } from "@/lib/calculate-nutrition";
import { THEME } from "@/lib/theme";
import { Drumstick, Flame, Ham, Milk } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useMemo } from "react";
import { View } from "react-native";
import GoalProgress from "./goal-progress";
import TodaysGoalSkeleton from "./loading";

const DUMMY_GOAL = {
  calories: 1600,
  protein: 100,
  carbs: 200,
  fat: 50,
};

export default function TodaysGoal() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { isLoading, listFoodLogs } = useUserActionsHook();

  const nutrition = useMemo(() => {
    const allDetails = listFoodLogs.flatMap((log) => log.details);
    return calculateNutrition(allDetails);
  }, [listFoodLogs]);

  return (
    <>
      {isLoading ? (
        <TodaysGoalSkeleton />
      ) : (
        <Card className="mt-8 shadow-none px-4 gap-3">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm">Today's Goal</Text>
              <Text className="text-3xl font-sans-bold">
                {nutrition.calories}
                <Text className="text-xl text-muted-foreground font-sans-bold">
                  {" "}
                  / {DUMMY_GOAL.calories}
                </Text>
              </Text>
            </View>
            <CircularProgress
              value={nutrition.calories}
              max={DUMMY_GOAL.calories}
              color={theme.primary}
              size={80}
              strokeWidth={10}
              trackStrokeWidth={5}
            >
              <View className="p-1 bg-primary rounded-full">
                <Flame
                  size={20}
                  color={theme.background}
                  fill={theme.background}
                />
              </View>
            </CircularProgress>
          </View>

          <Separator />

          <View className="flex-row justify-between px-4">
            <GoalProgress
              left={Math.max(0, DUMMY_GOAL.protein - nutrition.protein)}
              value={nutrition.protein}
              max={DUMMY_GOAL.protein}
              label="Protein left"
              color={theme.chart1}
              bgColor="bg-muted"
              icon={
                <Drumstick
                  size={12}
                  color={theme.primary}
                  fill={theme.chart1}
                />
              }
            />

            <GoalProgress
              left={Math.max(0, DUMMY_GOAL.carbs - nutrition.carbs)}
              value={nutrition.carbs}
              max={DUMMY_GOAL.carbs}
              label="Carbs left"
              bgColor="bg-muted"
              color={theme.chart2}
              icon={
                <Milk size={12} color={theme.primary} fill={theme.chart2} />
              }
            />

            <GoalProgress
              left={Math.max(0, DUMMY_GOAL.fat - nutrition.fats)}
              value={nutrition.fats}
              max={DUMMY_GOAL.fat}
              label="Fat left"
              bgColor="bg-muted"
              color={theme.chart4}
              icon={<Ham size={12} color={theme.primary} fill={theme.chart4} />}
            />
          </View>
        </Card>
      )}
    </>
  );
}
