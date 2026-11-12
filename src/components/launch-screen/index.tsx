import { Image } from "expo-image";
import { SplashScreen } from "expo-router";
import { useRef } from "react";
import { Appearance, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// Must match the expo-splash-screen config in app.json (image, imageWidth,
// backgroundColor), so the handoff from the native splash is invisible.
const MARK_WIDTH = 150;
const SPLASH = {
  light: {
    background: "#F4F4F5",
    mark: require("../../../assets/images/splash-mark.png"),
  },
  dark: {
    background: "#0C0C0E",
    mark: require("../../../assets/images/splash-mark-dark.png"),
  },
};

// The native splash follows the system theme, not the saved preference. Read
// at startup, before the preference is applied and overrides it.
const LAUNCH_SCHEME = Appearance.getColorScheme() === "dark" ? "dark" : "light";

interface IProps {
  // Called once the animation ends, to unmount the screen.
  onDone: () => void;
}

// A copy of the native splash drawn by the app, so the launch can animate
// out (Android only allows a static icon). It swaps in for the native one
// once the logo mark is on screen, then zooms and fades into the app.
export default function LaunchScreen({ onDone }: IProps) {
  const { background, mark } = SPLASH[LAUNCH_SCHEME];
  const progress = useSharedValue(0);

  // expo-image can report display more than once; animate only the first.
  const started = useRef(false);
  const start = () => {
    if (started.current) return;
    started.current = true;
    SplashScreen.hideAsync();
    progress.set(
      withDelay(
        100,
        withTiming(
          1,
          { duration: 500, easing: Easing.inOut(Easing.cubic) },
          (finished) => {
            if (finished) scheduleOnRN(onDone);
          },
        ),
      ),
    );
  };

  const screenStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0.4, 1], [1, 0], "clamp"),
  }));

  const markStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.get(), [0, 1], [1, 1.3]) }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.center,
        { backgroundColor: background },
        screenStyle,
      ]}
    >
      <Animated.View style={markStyle}>
        <Image
          source={mark}
          style={styles.mark}
          contentFit="contain"
          // Hide the native splash only once this one looks the same.
          onDisplay={start}
          onError={start}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  mark: { width: MARK_WIDTH, height: MARK_WIDTH },
});
