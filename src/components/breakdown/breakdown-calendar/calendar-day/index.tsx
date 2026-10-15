import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { DayStatus } from "../calendar.utils";
import { Circle } from "lucide-react-native";

// The expandable calendar sizes each week row at 46px: this cell (42) plus
// 2px above and below (`weekVerticalMargin`). The content (30px circle with
// its 6px dot right under it = 36px) is centred, so a dot sits against its own
// day and ~10px clear of the row below.
export const DAY_CELL_HEIGHT = 42;

interface IProps {
  day: number;
  isSelected: boolean;
  isToday: boolean;
  // Inside the week / month / year the breakdown covers.
  isInRange: boolean;
  // The range band connects to the previous / next cell in this row; it is
  // rounded off where it doesn't (range ends and row ends).
  joinsPrevious: boolean;
  joinsNext: boolean;
  // Another month's day shown to fill the grid.
  isOtherMonth: boolean;
  // Future, or before the account existed: dimmed and not pressable.
  isUnavailable: boolean;
  status: DayStatus;
  // Hide the status dot while the month's report is loading.
  showStatus: boolean;
  onPress: () => void;
}

// A rounded square for the number (filled when selected, outlined for today)
// over a pill-shaped band for the covered range, and a fixed slot under it
// for the status dot, so dots never shift the grid.
// The cell stretches across its column so neighbouring bands meet.
export default function CalendarDay({
  day,
  isSelected,
  isToday,
  isInRange,
  joinsPrevious,
  joinsNext,
  isOtherMonth,
  isUnavailable,
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
  // Solid, not translucent: the cap and the half bars overlap, and a
  // translucent colour would show darker where they do.
  const bandColor =
    colorScheme === "dark" ? "hsl(240 5% 15%)" : "hsl(240 5% 89%)";

  return (
    <Pressable
      onPress={onPress}
      disabled={isUnavailable}
      style={{ height: DAY_CELL_HEIGHT }}
      className="self-stretch items-center justify-center active:opacity-60"
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isUnavailable }}
    >
      {/* Range band: a round cap under the number, plus a half-width bar
          to each side that continues into a neighbouring day. */}
      {isInRange && (
        <View
          className="absolute inset-x-0 top-[3px] h-[32px]"
          pointerEvents="none"
        >
          {joinsPrevious && (
            <View
              className="absolute bottom-0 left-0 right-1/2 top-0"
              style={{ backgroundColor: bandColor }}
            />
          )}
          {joinsNext && (
            <View
              className="absolute bottom-0 left-1/2 right-0 top-0"
              style={{ backgroundColor: bandColor }}
            />
          )}
          <View
            className="absolute top-0 h-[32px] w-[32px] self-center rounded-full"
            style={{ backgroundColor: bandColor }}
          />
        </View>
      )}
      {/* Shape and colours as one inline style with every property always
          set: toggling border / background classes at runtime can make
          Android redraw the view without its corner radius (a square). */}
      <View
        className="h-[32px] w-[32px] items-center justify-center"
        style={{
          borderRadius: 16,
          borderWidth: !isSelected && isToday ? 1 : 0,
          borderColor: theme.foreground,
          backgroundColor: isSelected ? theme.primary : "transparent",
        }}
      >
        <Text
          className={cn(
            "text-sm",
            isSelected
              ? "font-sans-bold text-primary-foreground"
              : isUnavailable || isOtherMonth
                ? "text-muted-foreground opacity-50"
                : "text-foreground",
            isToday && !isSelected && "font-sans-bold",
          )}
        >
          {day}
        </Text>
      </View>
      {/* Fixed 6px slot so the row height never changes. */}
      <View className="h-1.5 w-1.5 items-center justify-center pt-1">
        {showStatus && status !== "none" && (
          <Circle size={7} strokeWidth={4} color={dotColor} fill={dotColor} />
        )}
      </View>
    </Pressable>
  );
}
