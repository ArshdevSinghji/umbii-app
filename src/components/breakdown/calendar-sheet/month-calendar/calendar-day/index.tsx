import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { DayStatus } from "../../calendar.utils";

export const DAY_CELL_WIDTH = 44;

interface IProps {
  day: number;
  isSelected: boolean;
  isToday: boolean;
  // Another month's day shown to fill the grid, or a future day.
  isMuted: boolean;
  isDisabled: boolean;
  status: DayStatus;
  // Hide the status dot while the month's report is loading.
  showStatus: boolean;
  onPress: () => void;
}

// A 36px circle for the number (filled when selected, ringed for today) and a
// fixed slot under it for the status dot, so dots never shift the grid.
export default function CalendarDay({
  day,
  isSelected,
  isToday,
  isMuted,
  isDisabled,
  status,
  showStatus,
  onPress,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const dotColor =
    status === "completed"
      ? theme.chart2
      : status === "incomplete"
        ? theme.chart4
        : "transparent";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={{ width: DAY_CELL_WIDTH }}
      className="items-center gap-1 py-1 active:opacity-60"
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
    >
      <View
        className={cn(
          "h-9 w-9 items-center justify-center rounded-full",
          isSelected && "bg-primary",
          !isSelected && isToday && "border border-foreground",
        )}
      >
        <Text
          className={cn(
            "text-sm",
            isSelected
              ? "font-sans-bold text-primary-foreground"
              : isMuted
                ? "text-muted-foreground opacity-50"
                : "text-foreground",
            isToday && !isSelected && "font-sans-bold",
          )}
        >
          {day}
        </Text>
      </View>
      <View
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: showStatus && !isMuted ? dotColor : "transparent",
        }}
      />
    </Pressable>
  );
}
