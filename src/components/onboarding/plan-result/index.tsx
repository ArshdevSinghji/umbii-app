import TargetBreakdown from "@/components/plan-targets/target-breakdown";
import TargetsOverview from "@/components/plan-targets/targets-overview";
import { Text } from "@/components/ui/text";
import { IGeneratedNutritionTarget } from "@/features/nutrition-target/nutrition-target.types";
import { ScrollView, View } from "react-native";
import OnboardingFooter from "../onboarding-footer";

interface IProps {
  target: IGeneratedNutritionTarget;
  onContinue: () => void;
}

// After "See my plan": the generated targets and how they were worked out.
// "Start tracking" acknowledges them and goes Home. (Editing comes later.)
export default function PlanResult({ target, onContinue }: IProps) {
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
        <TargetsOverview target={target} />
        <TargetBreakdown target={target} />
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
