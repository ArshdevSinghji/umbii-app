import { Text } from "@/components/ui/text";
import { WeightChartPoint } from "@/features/weight-journals/weight-journals.utils";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { area, curveMonotoneX, line } from "d3-shape";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

const CHART_HEIGHT = 180;
const PADDING = { top: 36, right: 16, bottom: 28, left: 44 };
const Y_TICKS = 5;
const MAX_X_LABELS = 7;
const BADGE_WIDTH = 48;

interface IProps {
  points: WeightChartPoint[];
  unit: string;
}

export default function WeightLineChart({ points, unit }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const color = theme.chart2;

  const [width, setWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(() =>
    points.findLastIndex((point) => point.isLogged),
  );

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
    point.weight === null ? null : ([getX(index), getY(point.weight)] as [number, number]),
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
  const columnWidth = points.length > 1 ? plotWidth / (points.length - 1) : plotWidth;

  const selected = points[selectedIndex];
  const selectedY =
    selected?.weight != null ? getY(selected.weight) : null;
  const badgeLeft = selected
    ? Math.min(
        Math.max(getX(selectedIndex) - BADGE_WIDTH / 2, 0),
        width - BADGE_WIDTH,
      )
    : 0;

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
            <Path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
            />

            {/* Dots and tap targets only on days the user actually logged. */}
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

            {coordinates.map((coordinate, index) =>
              coordinate && points[index].isLogged ? (
                <Rect
                  key={`hit-${points[index].date}`}
                  x={coordinate[0] - columnWidth / 2}
                  y={0}
                  width={columnWidth}
                  height={CHART_HEIGHT}
                  fill="transparent"
                  onPress={() => setSelectedIndex(index)}
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
                style={{ top: plotBottom + 8, left: getX(index) - 24, width: 48 }}
              >
                {point.label}
              </Text>
            );
          })}

          {selected && selectedY !== null && selected.progress !== null && (
            <View
              pointerEvents="none"
              className="absolute items-center rounded-full py-1"
              style={{
                top: selectedY - 34,
                left: badgeLeft,
                width: BADGE_WIDTH,
                backgroundColor: color,
              }}
            >
              <Text className="text-xs font-sans-bold text-white">
                {selected.progress.toFixed(0)}%
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}
