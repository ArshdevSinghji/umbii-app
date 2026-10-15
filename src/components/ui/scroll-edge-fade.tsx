import {
  FLOATING_INPUT_BAR_BOTTOM_OFFSET,
  FLOATING_TAB_BAR_BOTTOM_MARGIN,
  FLOATING_TAB_BAR_HEIGHT,
} from "@/lib/floating-tab-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// The colour content fades into, as RGB: the gradient needs plain colours,
// and its clear end must be the same colour at alpha 0 ("transparent" is
// transparent black and would grey the fade). Mirrors THEME.background /
// THEME.card.
const RGB = {
  light: { background: "244, 244, 245", card: "255, 255, 255" },
  dark: { background: "12, 12, 14", card: "34, 34, 38" },
};

// The food input: py-2 + a 40px line + its 1px border.
const FOOD_INPUT_HEIGHT = 58;
// How far above the floating controls the fade begins.
const FADE_EXTRA = 36;

interface IProps {
  // What's behind the scrolling content at the bottom of the screen.
  tone?: "background" | "card";
  // Log Food: also fade under the food input floating above the tab bar.
  coversFoodInput?: boolean;
}

// Scroll edge effect: content scrolling under the floating tab bar fades
// into the page instead of being cut off by a hard edge. Render it after the
// screen's ScrollView and before anything that floats above it (e.g. the
// food input), so it sits between the two. Touches pass through.
export function ScrollEdgeFade({
  tone = "background",
  coversFoodInput = false,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const rgb = RGB[colorScheme ?? "light"][tone];

  const height =
    insets.bottom +
    (coversFoodInput
      ? FLOATING_INPUT_BAR_BOTTOM_OFFSET + FOOD_INPUT_HEIGHT
      : FLOATING_TAB_BAR_BOTTOM_MARGIN + FLOATING_TAB_BAR_HEIGHT) +
    FADE_EXTRA;

  return (
    <LinearGradient
      pointerEvents="none"
      colors={[`rgba(${rgb}, 0)`, `rgba(${rgb}, 0.7)`, `rgba(${rgb}, 0.95)`]}
      // Mostly clear at the top, solid where the bar sits.
      locations={[0, 0.45, 1]}
      style={{ position: "absolute", left: 0, right: 0, bottom: 0, height }}
    />
  );
}
