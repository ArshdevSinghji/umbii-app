import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { ReactNode } from "react";
import { View } from "react-native";
import { RulerPicker } from "react-native-ruler-picker";

const SHORT_STEP = 18;
const LONG_STEP = 30;

interface IProps {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  range: { min: number; max: number; step: number };
  error?: string;
  // Rendered to the right of the label, e.g. a unit toggle.
  action?: ReactNode;
  // Small helper line under the label.
  hint?: string;
}

export default function MeasurementField({
  label,
  unit,
  value,
  onChange,
  range,
  error,
  action,
  hint,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-4">
        <View className="gap-0.5">
          <Text className="text-sm text-muted-foreground">{label}</Text>
          {hint && <Text className="text-xs text-muted-foreground">{hint}</Text>}
        </View>
        {action}
      </View>

      {/* Picker defaults to the window width; cancel the page padding. */}
      <View className="-mx-4">
        <RulerPicker
          min={range.min}
          max={range.max}
          step={range.step}
          fractionDigits={range.step < 1 ? 1 : 0}
          initialValue={value}
          unit={unit}
          onValueChangeEnd={(next) => onChange(parseFloat(next))}
          // Settle quickly on a tick instead of gliding past the value.
          decelerationRate="fast"
          // Steps hang from the top with a number under every long one;
          // long steps land on whole numbers (every 10th from `min`).
          stepAlignment="top"
          showLabels
          stepWidth={1}
          gapBetweenSteps={6}
          shortStepHeight={SHORT_STEP}
          longStepHeight={LONG_STEP}
          shortStepColor={theme.ring}
          longStepColor={theme.mutedForeground}
          indicatorWidth={4}
          indicatorHeight={LONG_STEP + 12}
          indicatorColor={theme.chart2}
          valueTextStyle={{ color: theme.foreground, fontSize: 32, fontFamily: "Caudex-Bold" }}
          unitTextStyle={{ color: theme.mutedForeground, fontSize: 16, fontFamily: "Caudex-Regular" }}
          labelTextStyle={{ color: theme.mutedForeground, fontSize: 12, fontFamily: "Caudex-Regular" }}
        />
      </View>

      {error && <Text className="text-sm text-destructive">{error}</Text>}
    </View>
  );
}
