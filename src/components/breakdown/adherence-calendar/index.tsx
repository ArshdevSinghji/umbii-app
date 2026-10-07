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
import AdherenceDaySkeleton from "./adherence-day/loading";

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
  const { report, isReportLoading, fetchNutritionTargetReport } =
    useNutritionTargetActionsHook();

  const [visibleMonth, setVisibleMonth] = useState(() => TODAY.slice(0, 7));

  const { startDate, endDate } = getMonthDateRange(visibleMonth);

  useEffect(() => {
    if (!user.id) return;
    fetchNutritionTargetReport(user.id, { startDate, endDate });
  }, [user.id, startDate, endDate]);

  // Before the first request starts, `report` is still null; treat that as
  // loading too so days never flash as empty before the skeleton shows.
  const isDaysLoading = isReportLoading || !report;

  const completedDates = report?.completedDates ?? [];
  const notCompleteDates = report?.notCompleteDates ?? [];

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
      {/* Dim the whole modal, not just the tap area, so the sheet's rounded
          corners show against the overlay instead of the white page. */}
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <Pressable className="flex-1" onPress={onClose} />

        <View className="bg-background rounded-t-3xl overflow-hidden p-6">
          {/* The calendar, month header, weekday row and legend always render;
              only the day cells swap to skeletons while the report loads. */}
          <View className="gap-4">
            <View className="px-2">
              <Calendar
                current={`${visibleMonth}-01`}
                onMonthChange={(month: DateData) =>
                  setVisibleMonth(month.dateString.slice(0, 7))
                }
                maxDate={TODAY}
                hideExtraDays={false}
                showSixWeeks
                enableSwipeMonths
                dayComponent={({ date }) => {
                  const isOutOfMonth =
                    !date || date.dateString.slice(0, 7) !== visibleMonth;

                  if (!date || isOutOfMonth) {
                    return <View className="w-9 h-9" />;
                  }

                  if (isDaysLoading) {
                    return <AdherenceDaySkeleton />;
                  }

                  const isCompleted = completedDates.includes(date.dateString);
                  const isNotCompleted = notCompleteDates.includes(
                    date.dateString,
                  );
                  // Only days the report knows about have anything to show.
                  const isDisabled = !(isCompleted || isNotCompleted);

                  return (
                    <AdherenceDay
                      day={date.day}
                      isSelected={date.dateString === selectedDate}
                      isDisabled={isDisabled}
                      isCompleted={isCompleted}
                      isNotCompleted={isNotCompleted}
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
                <Text className="text-muted-foreground text-xs">Completed</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="w-3 h-3 rounded-full border border-dashed border-muted-foreground" />
                <Text className="text-muted-foreground text-xs">
                  Incomplete
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
