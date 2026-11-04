import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { GENERATION_STAGES } from "../../hooks/use-meal-generation";

// A gentle breathing pulse: the status is clearly alive, never a frozen
// spinner.
function usePulse() {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.set(
      withRepeat(
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(opacity);
  }, [opacity]);
  return useAnimatedStyle(() => ({ opacity: opacity.get() }));
}

interface IProps {
  stage: number;
}

// Shown in the composer, where the placeholder sits, while a meal is worked
// out: a chip with a pulsing dot and the current step. Brighter than a
// placeholder so it reads as something happening.
export default function GenerationStatus({ stage }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const pulse = usePulse();

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      pointerEvents="none"
      className="flex-row items-center gap-2 self-start rounded-full bg-secondary px-3 py-1.5"
    >
      <Animated.View
        style={[
          {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.foreground,
          },
          pulse,
        ]}
      />
      {/* Remounted per stage, so each new step fades in. */}
      <Animated.View key={stage} entering={FadeIn.duration(250)}>
        <Animated.View style={pulse}>
          <Text className="font-sans text-sm">{GENERATION_STAGES[stage]}…</Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}
