import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { BackButton } from "../onboarding-header";

interface IProps {
  // Leaves the onboarding.
  onExit: () => void;
}

// Shown instead of the rest of the flow for anyone under 18. There's no
// way forward from here, only out.
export default function AgeGate({ onExit }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="flex-1 gap-6">
      <BackButton onPress={onExit} color={theme.foreground} />
      <View className="flex-1 justify-center gap-3">
        <Text className="font-sans-bold text-3xl">
          {"umbii targets are built for adults"}
        </Text>
        <Text className="text-sm text-muted-foreground">
          Please talk to a doctor or dietitian for a plan.
        </Text>
      </View>
    </View>
  );
}
