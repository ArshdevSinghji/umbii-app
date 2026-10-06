import {
  BMI_CATEGORIES,
  BMI_SCALE_MAX,
  BMI_SCALE_MIN,
  getBmiCategory,
} from "@/utils/calculate-bmi";
import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { useBmiColors } from "../../hooks/use-bmi-colors";

const BAR_HEIGHT = 10;
const MARKER_WIDTH = 10;
const MARKER_HEIGHT = 24;

// Deeper, more saturated shade of a theme `hsl(H S% L%)` colour.
const deepen = (color: string) => {
  const match = color.match(/hsl\(([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/);
  if (!match) return color;

  const [, hue, saturation, lightness] = match.map(Number);
  return `hsl(${hue} ${Math.min(100, saturation + 15)}% ${lightness * 0.75}%)`;
};

const toOffset = (bmi: number) =>
  Math.min(
    1,
    Math.max(0, (bmi - BMI_SCALE_MIN) / (BMI_SCALE_MAX - BMI_SCALE_MIN)),
  );

interface IProps {
  bmi: number;
}

export default function BmiScale({ bmi }: IProps) {
  const getColor = useBmiColors();
  const markerColor = deepen(getColor(getBmiCategory(bmi).label));

  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) =>
    setWidth(event.nativeEvent.layout.width);

  const markerLeft = Math.min(
    Math.max(toOffset(bmi) * width - MARKER_WIDTH / 2, 0),
    width - MARKER_WIDTH,
  );

  return (
    <View
      style={{ height: MARKER_HEIGHT }}
      className="justify-center"
      onLayout={handleLayout}
    >
      {width > 0 && (
        <>
          <Svg width={width} height={BAR_HEIGHT}>
            <Defs>
              <LinearGradient id="bmiScale" x1="0" y1="0" x2="1" y2="0">
                {BMI_CATEGORIES.map((category, index) => {
                  const next = BMI_CATEGORIES[index + 1];
                  // Place each colour in the middle of its range.
                  const mid = next
                    ? (Math.max(category.min, BMI_SCALE_MIN) + next.min) / 2
                    : (category.min + BMI_SCALE_MAX) / 2;

                  return (
                    <Stop
                      key={category.label}
                      offset={toOffset(mid)}
                      stopColor={getColor(category.label)}
                    />
                  );
                })}
              </LinearGradient>
            </Defs>
            <Rect
              width={width}
              height={BAR_HEIGHT}
              rx={BAR_HEIGHT / 2}
              fill="url(#bmiScale)"
            />
          </Svg>

          <View
            className="absolute rounded-full"
            style={{
              left: markerLeft,
              width: MARKER_WIDTH,
              height: MARKER_HEIGHT,
              backgroundColor: markerColor,
              borderColor: "#FFFFFF",
              borderWidth: 2.5,
              shadowColor: markerColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 4,
              elevation: 3,
            }}
          />
        </>
      )}
    </View>
  );
}
