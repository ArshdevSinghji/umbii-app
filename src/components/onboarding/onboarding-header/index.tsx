import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { CaretLeft } from "phosphor-react-native/src/icons/CaretLeft";
import { Pressable, View } from "react-native";

interface IProps {
  onBack: () => void;
  // 1-based question number, and how many there are.
  step: number;
  total: number;
}

// Back button, a progress bar and "2/4".
export default function OnboardingHeader({ onBack, step, total }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="flex-row items-center gap-3">
      <BackButton onPress={onBack} color={theme.foreground} />
      <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <View
          className="h-full rounded-full bg-foreground"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </View>
      <Text className="w-8 text-right text-xs text-muted-foreground">
        {`${step}/${total}`}
      </Text>
    </View>
  );
}

export function BackButton({
  onPress,
  color,
}: {
  onPress: () => void;
  color: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="size-10 items-center justify-center rounded-full bg-muted active:opacity-60"
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <CaretLeft size={18} color={color} />
    </Pressable>
  );
}
