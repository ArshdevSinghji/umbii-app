import { THEME } from "@/lib/theme";
import { BmiCategoryLabel } from "@/utils/calculate-bmi";
import { useColorScheme } from "nativewind";

type ChartColor = "chart1" | "chart2" | "chart3" | "chart4" | "chart5";

// Chart hues are the same in both themes, so one mapping keeps the
// "blue -> green -> yellow -> red" meaning in light and dark alike.
const BMI_CHART_COLORS: Record<BmiCategoryLabel, ChartColor> = {
  Underweight: "chart3",
  Healthy: "chart2",
  Overweight: "chart4",
  Obese: "chart1",
};

export function useBmiColors() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (label: BmiCategoryLabel) => theme[BMI_CHART_COLORS[label]];
}
