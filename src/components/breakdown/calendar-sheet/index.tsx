import { SheetHandle } from "@/components/ui/sheet-handle";
import { Text } from "@/components/ui/text";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { reportRequestError } from "@/lib/http-client";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { X } from "phosphor-react-native/src/icons/X";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMonthReportRange } from "./calendar.utils";
import MonthCalendar from "./month-calendar";

interface IProps {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

// Bottom sheet with the month calendar. Tapping a day picks it for the
// breakdown and closes the sheet. Remount it per opening (`key`) so it starts
// on the selected day's month.
export default function CalendarSheet({
  visible,
  selectedDate,
  onClose,
  onSelectDate,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { user } = useAppSelector((state) => state.userSlice);
  const { report, isReportLoading, fetchNutritionTargetReport } =
    useNutritionTargetActionsHook();

  // "yyyy-MM"
  const [month, setMonth] = useState(() => selectedDate.slice(0, 7));
  const { startDate, endDate } = getMonthReportRange(month);

  useEffect(() => {
    if (!visible || !user.id) return;
    fetchNutritionTargetReport(user.id, { startDate, endDate }).catch((error) =>
      reportRequestError("Error fetching report:", error),
    );
  }, [visible, user.id, startDate, endDate]);

  // Before the first request starts `report` is still null; treat that as
  // loading too so dots never flash in late.
  const isLoading = isReportLoading || !report;

  const handleSelectDate = (date: string) => {
    onSelectDate(date);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      {/* Dim the whole modal, so the rounded corners show against the
          overlay instead of the page behind. */}
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <Pressable className="flex-1" onPress={onClose} />

        {/* Fits its content: the calendar is always six weeks tall. */}
        <View
          className="rounded-t-3xl bg-background pt-6 px-2"
          style={{ paddingBottom: 24 + insets.bottom }}
        >
          <SheetHandle />
          <MonthCalendar
            month={month}
            onMonthChange={setMonth}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            completedDates={report?.completedDates ?? []}
            incompleteDates={report?.notCompleteDates ?? []}
            isLoading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
}
