import { Text } from "@/components/ui/text";
import { WeightChartPoint } from "@/features/weight-journals/weight-journals.utils";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { parseLocalDateKey } from "@/utils/date";
import { area, curveMonotoneX, line } from "d3-shape";
import { useColorScheme } from "nativewind";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useRef, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

const CHART_HEIGHT = 180;
// Top room fits the info label (TOOLTIP_HEIGHT) above the plot.
const PADDING = { top: 48, right: 16, bottom: 28, left: 44 };
const Y_TICKS = 5;
const MAX_X_LABELS = 7;
const TOOLTIP_WIDTH = 104;
const TOOLTIP_EXPANDED_WIDTH = 148;
// py-1 (8) + text-sm line (20) + text-[10px] line (~14).
const TOOLTIP_HEIGHT = 42;

interface IProps {
  points: WeightChartPoint[];
  unit: string;
  // Goal weight, for the "to goal" detail. Omit to leave it out.
  targetWeight?: number | null;
}

export default function WeightLineChart({
  points,
  unit,
  targetWeight,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const color = theme.chart2;

  const [width, setWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(() =>
    points.findLastIndex((point) => point.isLogged),
  );

  // The label shows weight and date; tapping the selected dot again opens
  // the extra details (and closes them). It stays open while scrubbing.
  const [isExpanded, setIsExpanded] = useState(false);
  // Per touch: did it start on the selected dot, and did it move the
  // selection? A plain tap on the selected dot toggles the details.
  const touchStartedOnSelected = useRef(false);
  const touchChangedSelection = useRef(false);

  const handleLayout = (event: LayoutChangeEvent) =>
    setWidth(event.nativeEvent.layout.width);

  const plotWidth = Math.max(0, width - PADDING.left - PADDING.right);
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const plotBottom = PADDING.top + plotHeight;

  const weights = points
    .map((point) => point.weight)
    .filter((weight): weight is number => weight !== null);
  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);
  const yPadding = Math.max((rawMax - rawMin) * 0.2, 1);
  const yMin = rawMin - yPadding;
  const yMax = rawMax + yPadding;

  const getX = (index: number) =>
    points.length === 1
      ? PADDING.left + plotWidth / 2
      : PADDING.left + (index / (points.length - 1)) * plotWidth;
  const getY = (weight: number) =>
    PADDING.top + ((yMax - weight) / (yMax - yMin)) * plotHeight;

  // null for days before the first ever entry; those are skipped.
  const coordinates = points.map((point, index) =>
    point.weight === null
      ? null
      : ([getX(index), getY(point.weight)] as [number, number]),
  );
  const plotted = coordinates.filter(
    (coordinate): coordinate is [number, number] => coordinate !== null,
  );

  const linePath = line().curve(curveMonotoneX)(plotted) ?? "";
  const areaPath = area().y0(plotBottom).curve(curveMonotoneX)(plotted) ?? "";

  const yTicks = Array.from(
    { length: Y_TICKS },
    (_, index) => yMax - (index * (yMax - yMin)) / (Y_TICKS - 1),
  );
  const yTickDecimals = yMax - yMin < Y_TICKS ? 1 : 0;

  const xLabelStep = Math.ceil(points.length / MAX_X_LABELS);

  // Nearest day the user actually logged to a touch at `x`; carried-forward
  // days have no reading of their own, so they're skipped.
  const getNearestLoggedIndex = (x: number) => {
    let nearest = -1;
    let nearestDistance = Infinity;
    points.forEach((point, index) => {
      if (!point.isLogged || point.weight === null) return;
      const distance = Math.abs(getX(index) - x);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    return nearest;
  };

  // Tap a dot or drag across the chart: the selection follows the finger.
  const handleTouch = (event: GestureResponderEvent) => {
    const index = getNearestLoggedIndex(event.nativeEvent.locationX);
    if (index !== -1 && index !== selectedIndex) {
      setSelectedIndex(index);
      touchChangedSelection.current = true;
    }
  };

  const handleTouchStart = (event: GestureResponderEvent) => {
    const index = getNearestLoggedIndex(event.nativeEvent.locationX);
    touchStartedOnSelected.current = index !== -1 && index === selectedIndex;
    touchChangedSelection.current = false;
    handleTouch(event);
  };

  const handleTouchEnd = () => {
    if (touchStartedOnSelected.current && !touchChangedSelection.current) {
      setIsExpanded((expanded) => !expanded);
    }
  };

  const selected = points[selectedIndex];
  const selectedX = selected ? getX(selectedIndex) : null;
  const selectedY = selected?.weight != null ? getY(selected.weight) : null;
  const tooltipWidth = isExpanded ? TOOLTIP_EXPANDED_WIDTH : TOOLTIP_WIDTH;
  const tooltipLeft =
    selectedX !== null
      ? Math.min(
          Math.max(selectedX - tooltipWidth / 2, 0),
          width - tooltipWidth,
        )
      : 0;

  // Extra details for the selected day, shown when the label is opened.
  const getDetails = () => {
    if (!selected || selected.weight === null) return [];
    const details: string[] = [];

    // Change since the previous weigh-in (carried-forward days skipped).
    for (let index = selectedIndex - 1; index >= 0; index--) {
      const previous = points[index];
      if (!previous.isLogged || previous.weight === null) continue;
      const change = selected.weight - previous.weight;
      const day = parseLocalDateKey(previous.date).toLocaleDateString(
        undefined,
        { weekday: "short" },
      );
      details.push(
        `${change >= 0 ? "+" : "−"}${Math.abs(change).toFixed(1)} ${unit} since ${day}`,
      );
      break;
    }

    if (targetWeight != null) {
      const remaining = Math.abs(selected.weight - targetWeight);
      details.push(
        remaining < 0.05
          ? "Goal reached"
          : `${remaining.toFixed(1)} ${unit} to goal`,
      );
    }

    if (selected.progress !== null) {
      details.push(`${selected.progress.toFixed(0)}% toward goal this week`);
    }

    return details;
  };
  const details = isExpanded ? getDetails() : [];
  const Chevron = isExpanded ? ChevronUp : ChevronDown;

  return (
    <View style={{ height: CHART_HEIGHT }} onLayout={handleLayout}>
      {width > 0 && (
        <>
          <Svg width={width} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity={0.25} />
                <Stop offset="1" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {yTicks.map((tick) => (
              <Line
                key={tick}
                x1={PADDING.left}
                x2={width - PADDING.right}
                y1={getY(tick)}
                y2={getY(tick)}
                stroke={theme.border}
                strokeDasharray="4 4"
              />
            ))}

            <Path d={areaPath} fill="url(#weightArea)" />
            <Path d={linePath} fill="none" stroke={color} strokeWidth={2.5} />

            {/* From the info label down to the selected dot. */}
            {selectedX !== null && selectedY !== null && (
              <Line
                x1={selectedX}
                x2={selectedX}
                y1={TOOLTIP_HEIGHT}
                y2={plotBottom}
                stroke={theme.mutedForeground}
                strokeOpacity={0.5}
                strokeWidth={1}
              />
            )}

            {/* Dots only on days the user actually logged. */}
            {coordinates.map((coordinate, index) =>
              coordinate && points[index].isLogged ? (
                <Circle
                  key={points[index].date}
                  cx={coordinate[0]}
                  cy={coordinate[1]}
                  r={index === selectedIndex ? 5 : 4}
                  fill={index === selectedIndex ? color : theme.card}
                  stroke={color}
                  strokeWidth={2}
                />
              ) : null,
            )}
          </Svg>

          {yTicks.map((tick) => (
            <Text
              key={`y-${tick}`}
              className="absolute left-0 text-[10px] text-muted-foreground"
              style={{ top: getY(tick) - 7, width: PADDING.left - 6 }}
            >
              {tick.toFixed(yTickDecimals)} {unit}
            </Text>
          ))}

          {points.map((point, index) => {
            const isLast = index === points.length - 1;
            if (index % xLabelStep !== 0 && !isLast) return null;

            return (
              <Text
                key={`x-${point.date}`}
                className={cn(
                  "absolute text-center text-xs text-muted-foreground",
                  index === selectedIndex && "font-sans-bold text-foreground",
                )}
                style={{
                  top: plotBottom + 8,
                  left: getX(index) - 24,
                  width: 48,
                }}
              >
                {point.label}
              </Text>
            );
          })}

          {/* Info for the selected day: weight and date; tap the selected
              dot again for more (the chevron hints at it). */}
          {selected && selected.weight !== null && (
            <View
              pointerEvents="none"
              className="absolute top-0 items-center rounded-lg bg-muted px-2 py-1"
              style={{ left: tooltipLeft, width: tooltipWidth }}
            >
              <Text className="text-sm font-sans-bold">
                {selected.weight.toFixed(1)}
                <Text className="text-xs text-muted-foreground">
                  {` ${unit}`}
                </Text>
              </Text>
              <View className="flex-row items-center gap-0.5">
                <Text className="text-[10px] text-muted-foreground">
                  {parseLocalDateKey(selected.date).toLocaleDateString(
                    undefined,
                    { weekday: "short", day: "numeric", month: "short" },
                  )}
                </Text>
                <Chevron size={10} color={theme.mutedForeground} />
              </View>
              {details.length > 0 && (
                <View className="mt-1 w-full gap-0.5 border-t border-border pt-1">
                  {details.map((detail) => (
                    <Text
                      key={detail}
                      className="text-center text-[10px] text-foreground"
                    >
                      {detail}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Touch layer over the whole chart for tapping and scrubbing. A
              vertical page scroll can still take the touch over. */}
          <View
            className="absolute inset-0"
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleTouchStart}
            onResponderMove={handleTouch}
            onResponderRelease={handleTouchEnd}
          />
        </>
      )}
    </View>
  );
}
