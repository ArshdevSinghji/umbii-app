import { THEME } from "@/lib/theme";
import {
  Canvas,
  Path,
  Skia,
  usePathValue,
  type SkPathBuilder,
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
// Silence never goes flat: bars rest at this height (share of the strip),
// plus a little random variation, so it still reads as listening.
const REST_LEVEL = 0.1;
const REST_JITTER = 0.06;
// Bars at or under this are drawn in the muted colour (silence).
const QUIET_LEVEL = REST_LEVEL + REST_JITTER + 0.02;
// Smoothing per frame (60fps): a voice rises fast and fades gently, so bars
// follow syllables without flickering.
const ATTACK = 0.5;
const RELEASE = 0.15;

// The strip starts at rest (oldest first). Made once, outside render.
const INITIAL_LEVELS = Array.from(
  { length: MAX_BARS },
  () => REST_LEVEL + Math.random() * REST_JITTER,
);

// Skia's colour parser strips spaces and splits on commas, so THEME's
// "hsl(0 0% 98%)" would parse as nothing and draw black.
const toSkiaColor = (color: string) =>
  color.replace(/^hsl\((\S+) (\S+) (\S+)\)$/, "hsl($1, $2, $3)");

interface IProps {
  // Live input volume, 0 (silence) to 1. Written from JS, read on the UI thread.
  level: SharedValue<number>;
  height?: number;
}

// Scrolling recorder waveform: rounded bars, mirrored around the middle,
// enter on the right and move left. Everything runs on the UI thread (a
// frame callback samples the level, Skia draws two paths), so JS work never
// makes it stutter.
export default function Waveform({ level, height = 28 }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const size = useSharedValue<SkSize>({ width: 0, height: 0 });
  // Oldest first.
  const levels = useSharedValue<number[]>(INITIAL_LEVELS);
  // The level smoothed frame by frame, and its loudest point since the last
  // sample (so short syllables between samples still show up).
  const envelope = useSharedValue(0);
  const peak = useSharedValue(0);
  // 0..1: how far the strip has moved toward the next sample.
  const progress = useSharedValue(0);

  useFrameCallback(({ timeSincePreviousFrame }) => {
    const target = level.value;
    const rate = target > envelope.value ? ATTACK : RELEASE;
    envelope.value += (target - envelope.value) * rate;
    peak.value = Math.max(peak.value, envelope.value);

    let next = progress.value + (timeSincePreviousFrame ?? 0) / SAMPLE_MS;
    if (next >= 1) {
      // After a long frame gap (e.g. app in background), add one bar and
      // carry on rather than catching up.
      next = Math.min(next - 1, 0.99);
      const sample = Math.max(
        peak.value,
        REST_LEVEL + Math.random() * REST_JITTER,
      );
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
    return (
      size.value.width - BAR_WIDTH + STEP * (1 - progress.value) - i * STEP
    );
  };

  const buildBars = (quiet: boolean) => {
    "worklet";
    return (path: SkPathBuilder) => {
      "worklet";
      const mid = size.value.height / 2;
      const values = levels.value;
      for (let i = 0; i < MAX_BARS; i++) {
        const x = barX(i);
        if (x < -BAR_WIDTH) break;
        const value = values[MAX_BARS - 1 - i];
        if (value <= QUIET_LEVEL !== quiet) continue;
        const h = Math.max(BAR_WIDTH, value * size.value.height);
        // Fully rounded ends: a pill, not a rectangle.
        path.addRRect(
          Skia.RRectXY(
            Skia.XYWHRect(x, mid - h / 2, BAR_WIDTH, h),
            BAR_WIDTH / 2,
            BAR_WIDTH / 2,
          ),
        );
      }
    };
  };

  const voiceBars = usePathValue(buildBars(false));
  const restBars = usePathValue(buildBars(true));

  return (
    // Fixed height, full width: `flex: 1` would let it stretch vertically
    // (its parent is a column) and draw bars taller than the composer.
    <Canvas style={{ width: "100%", height }} onSize={size}>
      <Path path={restBars} color={toSkiaColor(theme.mutedForeground)} />
      <Path path={voiceBars} color={toSkiaColor(theme.foreground)} />
    </Canvas>
  );
}
