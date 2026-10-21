import { THEME } from "@/lib/theme";
import {
  Canvas,
  Path,
  Skia,
  usePathValue,
  type SkSize,
} from "@shopify/react-native-skia";
import { useColorScheme } from "nativewind";
import {
  useFrameCallback,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

const BAR_WIDTH = 3;
const BAR_GAP = 3;
const STEP = BAR_WIDTH + BAR_GAP;
// One new bar per sample. The strip moves STEP px per sample, so this also
// sets the scroll speed (~85 px/s).
const SAMPLE_MS = 70;
// Enough bars to fill the widest bar we render; older ones scroll off.
const MAX_BARS = 100;
// Quieter than this is drawn as a dot on the baseline, not a bar.
const QUIET = 0.06;
const DOT_RADIUS = 1;

interface IProps {
  // Live input volume, 0 (silence) to 1. Written from JS, read on the UI thread.
  level: SharedValue<number>;
  height?: number;
}

// Scrolling recorder waveform: bars enter on the right and move left, silence
// is a dotted line. Everything runs on the UI thread (a frame callback samples
// the level, Skia draws two paths), so JS work never makes it stutter.
export default function Waveform({ level, height = 32 }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const size = useSharedValue<SkSize>({ width: 0, height: 0 });
  // Oldest first. Starts silent, so the strip opens as a dotted line.
  const levels = useSharedValue<number[]>(new Array(MAX_BARS).fill(0));
  // Loudest level since the last sample, so short syllables between samples
  // still show up.
  const peak = useSharedValue(0);
  // 0..1: how far the strip has moved toward the next sample.
  const progress = useSharedValue(0);

  useFrameCallback(({ timeSincePreviousFrame }) => {
    peak.value = Math.max(peak.value, level.value);
    let next = progress.value + (timeSincePreviousFrame ?? 0) / SAMPLE_MS;
    if (next >= 1) {
      // After a long frame gap (e.g. app in background), add one bar and
      // carry on rather than catching up.
      next = Math.min(next - 1, 0.99);
      const sample = peak.value;
      levels.modify((values) => {
        "worklet";
        values.shift();
        values.push(sample);
        return values;
      });
      peak.value = 0;
    }
    progress.value = next;
  });

  // Bar i (0 = newest) sits i steps left of the right edge, shifted by the
  // scroll progress. The newest one starts just past the edge and slides in.
  const barX = (i: number) => {
    "worklet";
    return size.value.width - BAR_WIDTH + STEP * (1 - progress.value) - i * STEP;
  };

  const bars = usePathValue((path) => {
    "worklet";
    const mid = size.value.height / 2;
    const values = levels.value;
    for (let i = 0; i < MAX_BARS; i++) {
      const x = barX(i);
      if (x < -BAR_WIDTH) break;
      const value = values[MAX_BARS - 1 - i];
      if (value < QUIET) continue;
      const h = Math.max(BAR_WIDTH, value * size.value.height);
      path.addRRect(
        Skia.RRectXY(
          Skia.XYWHRect(x, mid - h / 2, BAR_WIDTH, h),
          BAR_WIDTH / 2,
          BAR_WIDTH / 2,
        ),
      );
    }
  });

  const dots = usePathValue((path) => {
    "worklet";
    const mid = size.value.height / 2;
    const values = levels.value;
    for (let i = 0; i < MAX_BARS; i++) {
      const x = barX(i);
      if (x < -BAR_WIDTH) break;
      if (values[MAX_BARS - 1 - i] >= QUIET) continue;
      path.addCircle(x + BAR_WIDTH / 2, mid, DOT_RADIUS);
    }
  });

  return (
    <Canvas style={{ flex: 1, height }} onSize={size}>
      <Path path={dots} color={theme.mutedForeground} opacity={0.6} />
      <Path path={bars} color={theme.foreground} opacity={0.85} />
    </Canvas>
  );
}
