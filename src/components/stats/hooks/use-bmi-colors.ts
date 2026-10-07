import { THEME } from "@/lib/theme";
import { BmiCategoryLabel } from "@/utils/calculate-bmi";
import { useColorScheme } from "nativewind";

type ChartColor = "chart1" | "chart2" | "chart3" | "chart4" | "chart5";

// The chart palette differs per theme, so pick the key that keeps
// the "blue -> green -> orange -> red" meaning in each one.
const BMI_CHART_COLORS: Record<
  "light" | "dark",
  Record<BmiCategoryLabel, ChartColor>
> = {
  light: {
    Underweight: "chart3",
    Healthy: "chart2",
    Overweight: "chart4",
    Obese: "chart1",
  },
  dark: {
    Underweight: "chart1",
    Healthy: "chart2",
    Overweight: "chart3",
    Obese: "chart5",
  },
};

export function useBmiColors() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? "light";
  const theme = THEME[scheme];

  return (label: BmiCategoryLabel) => theme[BMI_CHART_COLORS[scheme][label]];
}
