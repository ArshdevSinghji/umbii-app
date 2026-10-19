import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { ArrowDown } from "phosphor-react-native/src/icons/ArrowDown";
import { Barbell } from "phosphor-react-native/src/icons/Barbell";
import { Scales } from "phosphor-react-native/src/icons/Scales";
import { Pressable, View } from "react-native";
import { GoalType } from "../onboarding.types";

interface IProps {
  goalType: GoalType | null;
  onChange: (goalType: GoalType) => void;
}

// Three cards side by side, each with its own colour.
export default function GoalStep({ goalType, onChange }: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const goals = [
    {
      value: GoalType.FatLoss,
      label: "Lose fat",
      Icon: ArrowDown,
      color: theme.chart1,
    },
    {
      value: GoalType.Maintenance,
      label: "Maintain",
      Icon: Scales,
      color: theme.chart4,
    },
    {
      value: GoalType.Hypertrophy,
      label: "Build muscle",
      Icon: Barbell,
      color: theme.chart2,
    },
  ];

  return (
    <View className="flex-row gap-2">
      {goals.map(({ value, label, Icon, color }) => {
        const isSelected = value === goalType;
        return (
          <Pressable
            key={value}
            onPress={() => onChange(value)}
            className={cn(
              "h-24 flex-1 justify-between rounded-2xl border bg-card p-3 active:opacity-70",
              isSelected ? "border-foreground" : "border-border",
            )}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Icon size={20} color={color} weight="bold" />
            <Text className="font-sans-bold text-sm">{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
