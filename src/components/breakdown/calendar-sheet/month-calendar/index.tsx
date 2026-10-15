import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { toLocalDateKey } from "@/utils/date";
import { CaretLeft } from "phosphor-react-native/src/icons/CaretLeft";
import { CaretRight } from "phosphor-react-native/src/icons/CaretRight";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import {
  DayStatus,
  formatMonthTitle,
  getCurrentMonth,
  shiftMonth,
} from "../calendar.utils";
import CalendarDay from "./calendar-day";

interface IProps {
  // "yyyy-MM"
  month: string;
  onMonthChange: (month: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  completedDates: string[];
  incompleteDates: string[];
  isLoading: boolean;
}

export default function MonthCalendar({
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  completedDates,
  incompleteDates,
  isLoading,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const today = toLocalDateKey();
  const isCurrentMonth = month >= getCurrentMonth();

  // Never go past the current month (also guards swipes).
  const goToMonth = (next: string) =>
    onMonthChange(next > getCurrentMonth() ? getCurrentMonth() : next);

  const getStatus = (date: string): DayStatus =>
    completedDates.includes(date)
      ? "completed"
      : incompleteDates.includes(date)
        ? "incomplete"
        : "none";

  return (
    <Card className="gap-2 px-3 py-4">
      {/* ‹ October 2026 › */}
      <View className="flex-row items-center justify-center gap-4 pb-1">
        <Pressable
          onPress={() => goToMonth(shiftMonth(month, -1))}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          className="active:opacity-60"
        >
          <CaretLeft size={20} color={theme.foreground} />
        </Pressable>
        <Text className="min-w-36 text-center font-sans-bold text-base">
          {formatMonthTitle(month)}
        </Text>
        <Pressable
          onPress={() => goToMonth(shiftMonth(month, 1))}
          disabled={isCurrentMonth}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          className="active:opacity-60"
          style={{ opacity: isCurrentMonth ? 0.25 : 1 }}
        >
          <CaretRight size={20} color={theme.foreground} />
        </Pressable>
      </View>

      <Calendar
        // Remount per month: `current` only sets the initial month.
        key={month}
        current={`${month}-01`}
        onMonthChange={(next: DateData) =>
          goToMonth(next.dateString.slice(0, 7))
        }
        enableSwipeMonths
        hideArrows
        // Our own month bar above replaces the built-in title.
        renderHeader={() => null}
        hideExtraDays={false}
        // Always six rows, so switching months never changes the height.
        showSixWeeks
        dayComponent={({ date }) => {
          if (!date) return <View />;
          const key = date.dateString;
          const isOtherMonth = key.slice(0, 7) !== month;
          const isFuture = key > today;

          return (
            <CalendarDay
              day={date.day}
              isSelected={key === selectedDate}
              isToday={key === today}
              isMuted={isOtherMonth || isFuture}
              isDisabled={isOtherMonth || isFuture}
              status={getStatus(key)}
              showStatus={!isLoading}
              onPress={() => onSelectDate(key)}
            />
          );
        }}
        theme={{
          calendarBackground: "transparent",
          textSectionTitleColor: theme.mutedForeground,
          textDayHeaderFontFamily: "Caudex-Bold",
          textDayHeaderFontSize: 13,
        }}
        style={{ backgroundColor: "transparent" }}
      />

      <View className="flex-row items-center justify-center gap-5 pt-1">
        <LegendDot color={theme.chart2} label="Goal met" />
        <LegendDot color={theme.chart4} label="Logged, goal missed" />
      </View>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  );
}
