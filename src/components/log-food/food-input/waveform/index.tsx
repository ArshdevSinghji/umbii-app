import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const BAR_COUNT = 60;
const BAR_WIDTH = 4;
const BAR_GAP = 2;
const MIN_HEIGHT = 3;
const MAX_HEIGHT = 48;
const SCROLL_INTERVAL = 60;

interface IProps {
  audioLevelRef: React.MutableRefObject<number>;
  isRecording: boolean;
}

export default function Waveform({ audioLevelRef, isRecording }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const levelHistory = useRef<number[]>(Array(BAR_COUNT).fill(0));
  const smoothedLevel = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const barHeights = useRef<Animated.Value[]>(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(MIN_HEIGHT))
  ).current;

  const barOpacities = useRef<Animated.Value[]>(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.2))
  ).current;

  const updateBars = () => {
    levelHistory.current.forEach((level, i) => {
      const height = MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * level;

      Animated.timing(barHeights[i], {
        toValue: height,
        duration: SCROLL_INTERVAL,
        useNativeDriver: false,
      }).start();

      Animated.timing(barOpacities[i], {
        toValue: 0.2 + level * 0.8,
        duration: SCROLL_INTERVAL,
        useNativeDriver: false,
      }).start();
    });
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isRecording) {
      // drain to silence
      intervalRef.current = setInterval(() => {
        levelHistory.current = [0, ...levelHistory.current.slice(0, BAR_COUNT - 1)];
        updateBars();
        if (levelHistory.current.every((l) => l === 0)) {
          clearInterval(intervalRef.current!);
        }
      }, SCROLL_INTERVAL);
      return;
    }

    intervalRef.current = setInterval(() => {
      // read ref directly — no React re-render lag
      const rawLevel = audioLevelRef.current;

      // smooth it
      smoothedLevel.current = smoothedLevel.current * 0.4 + rawLevel * 0.6;

      const variance =
        smoothedLevel.current > 0.03
          ? smoothedLevel.current * (0.85 + Math.random() * 0.3)
          : Math.random() * 0.03;

      levelHistory.current = [variance, ...levelHistory.current.slice(0, BAR_COUNT - 1)];
      updateBars();
    }, SCROLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]); // no audioLevel dependency — we read ref directly

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        gap: BAR_GAP,
      }}
    >
      {[...barHeights].reverse().map((height, i) => (
        <Animated.View
          key={i}
          style={{
            width: BAR_WIDTH,
            height,
            borderRadius: 999,
            backgroundColor: theme.primary,
            opacity: [...barOpacities].reverse()[i],
          }}
        />
      ))}
    </View>
  );
}