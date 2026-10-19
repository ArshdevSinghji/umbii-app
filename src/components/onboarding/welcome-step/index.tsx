import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import OnboardingFooter from "../onboarding-footer";
import { BackButton } from "../onboarding-header";

interface IProps {
  // Omitted when there's nowhere to go back to (first-time users land here).
  onBack?: () => void;
  onStart: () => void;
}

// The intro: what's about to happen and how long it takes.
export default function WelcomeStep({ onBack, onStart }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { user } = useAppSelector((state) => state.userSlice);
  const firstName = user.username?.split(" ")[0];

  return (
    <View className="flex-1 justify-between">
      <View className="flex-row items-center">
        {onBack ? (
          <BackButton onPress={onBack} color={theme.foreground} />
        ) : (
          <View className="size-10" />
        )}
        {/* Centred over the whole row; the spacer balances the button. */}
        <Text className="flex-1 text-center font-sans-bold text-2xl">
          umbii
        </Text>
        <View className="size-10" />
      </View>

      <View className="gap-6">
        <View className="gap-3">
          <Text className="text-sm text-muted-foreground">
            {firstName ? `Hi ${firstName}, welcome in` : "Welcome in"}
          </Text>
          {/* No lone last word: "fits you" is joined by a non-breaking
              space, so it wraps as a pair; the lines still fill the width. */}
          <Text className="font-sans-bold text-3xl">
            {"Let's build a plan that fits\u00A0you"}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {`A few quick questions about you, your goal, your week and your food. We'll turn them into your daily calories and macros. Takes about a minute.`}
          </Text>
        </View>
        <OnboardingFooter label="Get started" onPress={onStart} />
      </View>
    </View>
  );
}
