import { Text } from "@/components/ui/text";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { CircleCheck } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import AdherenceDay from "./adherence-day";
import AdherenceCalendarSkeleton from "./loading";

interface IProps {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

const TODAY = new Date().toISOString().split("T")[0];

function getMonthDateRange(monthDateString: string) {
  const [year, month] = monthDateString.split("-").map(Number);
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
  const lastOfMonth = new Date(year, month, 0).toISOString().split("T")[0];

  return { startDate, endDate: TODAY < lastOfMonth ? TODAY : lastOfMonth };
}

export default function AdherenceCalendar({
  visible,
  selectedDate,
  onClose,
  onSelectDate,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  const {
    report,
    isReportLoading,
    fetchNutritionTargetReport,
  } = useNutritionTargetActionsHook();

  const [visibleMonth, setVisibleMonth] = useState(() => TODAY.slice(0, 7));
  const [minDate, setMinDate] = useState<string | undefined>(undefined);

  const { startDate, endDate } = getMonthDateRange(visibleMonth);

  useEffect(() => {
    if (!user.id) return;
    fetchNutritionTargetReport(user.id, { startDate, endDate });
  }, [user.id, startDate, endDate]);

  // The report only ever contains entries for days the account has existed.
  // If this month's earliest entry isn't the 1st, that's the account's
  // first month — lock the calendar from going back any further.
  useEffect(() => {
    if (!report) return;

    const earliestInMonth = [
      ...report.completedDates,
      ...report.notCompleteDates,
      ...report.missedDates,
    ].sort()[0];
    const firstOfMonth = `${visibleMonth}-01`;

    if (earliestInMonth && earliestInMonth !== firstOfMonth) {
      setMinDate((prev) =>
        prev && prev < earliestInMonth ? prev : earliestInMonth,
      );
    }
  }, [report, visibleMonth]);

  const completedDates = report?.completedDates ?? [];
  console.log("report ==> ", report);
  const notCompleteDates = report?.notCompleteDates ?? [];
  const missedDates = report?.missedDates ?? [];

  const handleDayPress = (dateString: string) => {
    onSelectDate(dateString);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable
          className="flex-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          onPress={onClose}
        />

        <View className="bg-background rounded-t-3xl overflow-hidden p-6">
          {isReportLoading ? (
            <AdherenceCalendarSkeleton />
          ) : (
            <View className="gap-4">
              <View className="px-2">
                <Calendar
                  current={`${visibleMonth}-01`}
                  onMonthChange={(month: DateData) =>
                    setVisibleMonth(month.dateString.slice(0, 7))
                  }
                  minDate={minDate}
                  maxDate={TODAY}
                  hideExtraDays={false}
                  showSixWeeks
                  enableSwipeMonths
                  dayComponent={({ date, state }) => {
                    const isOutOfMonth =
                      !date || date.dateString.slice(0, 7) !== visibleMonth;

                    if (!date || isOutOfMonth) {
                      return <View className="w-9 h-9" />;
                    }

                    const isCompleted = completedDates.includes(
                      date.dateString,
                    );
                    const isNotCompleted = notCompleteDates.includes(
                      date.dateString,
                    );
                    // Missed days (and days we simply have no data for) show
                    // up, but there's nothing to view — only a day with real
                    // food-log data can be selected.
                    const isDisabled =
                      state === "disabled" || !(isCompleted || isNotCompleted);

                    return (
                      <AdherenceDay
                        day={date.day}
                        isSelected={date.dateString === selectedDate}
                        isDisabled={isDisabled}
                        isCompleted={isCompleted}
                        isNotCompleted={isNotCompleted}
                        isMissed={missedDates.includes(date.dateString)}
                        onPress={() => handleDayPress(date.dateString)}
                      />
                    );
                  }}
                  theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    monthTextColor: theme.foreground,
                    arrowColor: theme.foreground,
                    textSectionTitleColor: theme.mutedForeground,
                    textDisabledColor: theme.mutedForeground,
                  }}
                  style={{ backgroundColor: "transparent" }}
                />
              </View>

              <View className="flex-row items-center justify-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <CircleCheck
                    size={12}
                    fill={theme.chart2}
                    color={theme.primaryForeground}
                  />
                  <Text className="text-muted-foreground text-xs">
                    Completed
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <View className="w-3 h-3 rounded-full border border-dashed border-muted-foreground" />
                  <Text className="text-muted-foreground text-xs">
                    Incomplete
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <View className="w-3 h-3 rounded-full bg-muted" />
                  <Text className="text-muted-foreground text-xs">
                    Missed
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
