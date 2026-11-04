import { GoalType } from "@/components/onboarding/onboarding.types";
import { TARGET_MARGIN_KG } from "@/components/onboarding/onboarding.utils";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { Info } from "phosphor-react-native/src/icons/Info";
import { View } from "react-native";

interface IProps {
  goalType: Exclude<GoalType, GoalType.Maintenance>;
  // The latest weigh-in the target is measured from.
  weightKg: number;
}

// Under the target ruler: why it stops short of the current weight. Within
// the margin the server counts the target as reached and plans for
// maintaining, so a target that close is rejected.
export default function TargetMarginNote({ goalType, weightKg }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const isLoss = goalType === GoalType.FatLoss;
  const direction = isLoss ? "below" : "above";
  const aim = isLoss ? "losing" : "gaining";

  return (
    <View className="flex-row gap-3 rounded-2xl bg-muted p-3">
      <Info size={18} color={theme.mutedForeground} />
      <Text className="flex-1 text-xs text-muted-foreground">
        {`Your target starts ${TARGET_MARGIN_KG} kg ${direction} your current weight (${weightKg} kg). Anything closer counts as already reached, so your plan would be for maintaining, not ${aim}.`}
      </Text>
    </View>
  );
}
