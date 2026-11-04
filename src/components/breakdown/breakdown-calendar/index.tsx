import { Text } from "@/components/ui/text";
import { useNutritionTargetActionsHook } from "@/features/nutrition-target/nutrition-target.hooks";
import { reportRequestError } from "@/lib/http-client";
import { THEME } from "@/lib/theme";
import { useAppSelector } from "@/store/hooks";
import { parseLocalDateKey, toLocalDateKey } from "@/utils/date";
import { CaretLeft } from "phosphor-react-native/src/icons/CaretLeft";
import { CaretRight } from "phosphor-react-native/src/icons/CaretRight";
import { CircleIcon } from "phosphor-react-native/src/icons/Circle";
import { useColorScheme } from "nativewind";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { LayoutChangeEvent, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { DateData, ExpandableCalendar } from "react-native-calendars";
import { DayState, MarkedDates } from "react-native-calendars/src/types";
import CalendarDay from "./calendar-day";
import {
  CALENDAR_WEEK_HEIGHT,
  DayStatus,
  FIRST_DAY,
  getMonthGridReportRange,
  getAccountStartDate,
  getWeeksInMonth,
  isAtEarliestPage,
  isAtLatestPage,
  monthsBetween,
} from "./calendar.utils";

// What each day needs, passed through the library's `markedDates` so only
// the months whose marks change re-render.
type DayMarking = {
  selected?: boolean;
  inRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  status?: DayStatus;
};

// Read by every day cell. A context, so a change re-renders just the days.
// isOpen: only the month grid dims other months' days (a week strip is one
// continuous row). minDate: the account's first day; earlier days are off.
const DayCellContext = createContext<{
  isOpen: boolean;
  minDate: string | null;
}>({ isOpen: true, minDate: null });

interface IDayCellProps {
  date?: DateData;
  // "disabled" for other months' days and anything outside minDate–maxDate.
  state?: DayState;
  marking?: DayMarking;
  onPress?: (date?: DateData) => void;
}

// Module-level, so the calendar always gets the same component type: an
// inline function would be a new type per render and remount every day of
// every mounted month.
function DayCell({ date, state, marking, onPress }: IDayCellProps) {
  const { isOpen, minDate } = useContext(DayCellContext);
  if (!date) return <View />;

  const today = toLocalDateKey();
  const isUnavailable =
    date.dateString > today || (!!minDate && date.dateString < minDate);
  // Monday starts a row and Sunday ends it (FIRST_DAY = Monday).
  const weekday = parseLocalDateKey(date.dateString).getDay();
  const isRowStart = weekday === FIRST_DAY;
  const isRowEnd = weekday === (FIRST_DAY + 6) % 7;

  return (
    <CalendarDay
      day={date.day}
      isSelected={!!marking?.selected}
      isToday={date.dateString === today}
      isInRange={!!marking?.inRange}
      joinsPrevious={!marking?.isRangeStart && !isRowStart}
      joinsNext={!marking?.isRangeEnd && !isRowEnd}
      isOtherMonth={isOpen && state === "disabled" && !isUnavailable}
      isUnavailable={isUnavailable}
      status={marking?.status ?? "none"}
      showStatus
      onPress={() => onPress?.(date)}
    />
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <CircleIcon size={10} color={color} weight="fill" />
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  );
}

// Month name with the year under it.
// `date` is the library's XDate; only its year and month are read.
const renderHeader = (date?: { getFullYear(): number; getMonth(): number }) => {
  const month = date
    ? new Date(date.getFullYear(), date.getMonth(), 1)
    : new Date();
  return (
    <View className="items-center">
      <Text className="font-sans-bold text-xl">
        {month.toLocaleDateString(undefined, { month: "long" })}
      </Text>
      <Text className="text-xs text-muted-foreground">
        {month.getFullYear()}
      </Text>
    </View>
  );
};

// Paging never moves the selection: only a tapped day (or the prop) does.
export const KEEP_SELECTION_ON = [
  ExpandableCalendar.navigationTypes.MONTH_SCROLL,
  ExpandableCalendar.navigationTypes.WEEK_SCROLL,
  ExpandableCalendar.navigationTypes.MONTH_ARROWS,
  ExpandableCalendar.navigationTypes.WEEK_ARROWS,
  ExpandableCalendar.navigationTypes.TODAY_PRESS,
];

interface IProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  // The covered range to tint; null for a single day.
  range: { startDate: string; endDate: string } | null;
  // The day the calendar is showing (follows arrows and swipes), from the
  // CalendarProvider around it.
  visibleDate: string;
  // Where the calendar sits in its parent (`top`) and the height of its
  // month title + weekday row, so the sheet can rest just under the grid.
  onMeasure: (frame: ICalendarFrame) => void;
}

export interface ICalendarFrame {
  top: number;
  headerHeight: number;
}

// Month grid, always open: it never folds into its week strip (re-laying out
// every month page is heavy). The content sheet over it is what you drag
// (see Breakdown). Must sit inside a CalendarProvider.
// Everything handed to the calendar is kept stable (memoised) between
// renders: its month pages are memoised on their props, and a new object or
// function would re-render all of them.
export default function BreakdownCalendar({
  selectedDate,
  onSelectDate,
  range,
  visibleDate,
  onMeasure,
}: IProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { user } = useAppSelector((state) => state.userSlice);
  // Breakdown's own month report, so it never replaces Home's week circles.
  const {
    calendarReport: report,
    isCalendarReportLoading: isReportLoading,
    fetchCalendarNutritionTargetReport,
  } = useNutritionTargetActionsHook();

  const headerHeight = useRef<number | null>(null);
  const lastTop = useRef<number | null>(null);
  const minDate = getAccountStartDate(user.createdAt);
  // How far the month list may scroll, counted from the month it first
  // rendered on (fixed after mount): forward to the current month, back to
  // the account's first month (two years if that's unknown).
  const [futureScrollRange] = useState(() => monthsBetween(selectedDate));
  const [pastScrollRange] = useState(() =>
    minDate ? monthsBetween(minDate, selectedDate) : 24,
  );
  const dayCellContext = useMemo(() => ({ isOpen: true, minDate }), [minDate]);

  const { startDate, endDate } = getMonthGridReportRange(
    visibleDate.slice(0, 7),
  );

  // On every focus too, so the dots reflect meals logged on another tab;
  // reloading the same month keeps the dots up meanwhile.
  useFocusEffect(
    useCallback(() => {
      if (!user.id) return;
      fetchCalendarNutritionTargetReport(user.id, { startDate, endDate }).catch(
        (error) => reportRequestError("Error fetching report:", error),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id, startDate, endDate]),
  );

  // Before the first request starts `report` is still null; no dots until
  // it has loaded, so they never flash in late.
  const isLoading = isReportLoading || !report;
  const rangeStart = range?.startDate;
  const rangeEnd = range?.endDate;

  const markedDates = useMemo(() => {
    const marks: Record<string, DayMarking> = {};
    const mark = (date: string, value: DayMarking) => {
      marks[date] = { ...marks[date], ...value };
    };

    if (!isLoading) {
      report.completedDates.forEach((date) =>
        mark(date, { status: "completed" }),
      );
      report.notCompleteDates.forEach((date) =>
        mark(date, { status: "incomplete" }),
      );
    }
    if (rangeStart && rangeEnd) {
      const day = parseLocalDateKey(rangeStart);
      for (let key = rangeStart; key <= rangeEnd; key = toLocalDateKey(day)) {
        mark(key, {
          inRange: true,
          isRangeStart: key === rangeStart,
          isRangeEnd: key === rangeEnd,
        });
        day.setDate(day.getDate() + 1);
      }
    }
    mark(selectedDate, { selected: true });

    return marks as MarkedDates;
  }, [isLoading, report, rangeStart, rangeEnd, selectedDate]);

  const isLatest = isAtLatestPage(visibleDate, true);
  const isEarliest = isAtEarliestPage(visibleDate, true, minDate);

  const renderArrow = useCallback(
    (direction: "left" | "right") => {
      const Icon = direction === "left" ? CaretLeft : CaretRight;
      const isDisabled = direction === "right" ? isLatest : isEarliest;
      return (
        <View
          className="rounded-lg border border-foreground p-0.5"
          style={{ opacity: isDisabled ? 0.25 : 1 }}
        >
          <Icon size={18} color={theme.foreground} />
        </View>
      );
    },
    [isLatest, isEarliest, theme.foreground],
  );

  // The library doesn't expose its header height, so work it out once from
  // the open grid's height: header + one row per week of the month shown.
  // (Its first layout comes before the header is measured, hence `> 0`.)
  const handleLayout = (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    if (headerHeight.current === null) {
      const header =
        height - CALENDAR_WEEK_HEIGHT * getWeeksInMonth(visibleDate);
      if (header <= 0) return;
      headerHeight.current = header;
    }
    // Height changes (months with more or fewer weeks) don't move the top.
    if (y === lastTop.current) return;
    lastTop.current = y;
    onMeasure({ top: y, headerHeight: headerHeight.current });
  };

  const handleDayPress = useCallback(
    (date: DateData) => onSelectDate(date.dateString),
    [onSelectDate],
  );

  // Memoised: a new theme object re-renders every month page.
  const calendarTheme = useMemo(
    () => ({
      calendarBackground: theme.background,
      textSectionTitleColor: theme.mutedForeground,
      textDayHeaderFontFamily: "Caudex-Bold",
      textDayHeaderFontSize: 13,
      weekVerticalMargin: 2,
      arrowStyle: { padding: 6 },
    }),
    [theme.background, theme.mutedForeground],
  );

  return (
    <DayCellContext.Provider value={dayCellContext}>
      {/* What the dots under the days mean. */}
      <View className="flex-row items-center gap-5 px-4 pb-2">
        <LegendDot color={theme.chart2} label="Goal met" />
        <LegendDot color={theme.chart4} label="Goal missed" />
      </View>
      <View onLayout={handleLayout}>
        <ExpandableCalendar
          initialPosition={ExpandableCalendar.positions.OPEN}
          // The sheet over it does the dragging, so no pan or knob here.
          disablePan
          hideKnob
          // Stay open after picking a day.
          closeOnDayPress={false}
          allowShadow={false}
          firstDay={FIRST_DAY}
          pastScrollRange={pastScrollRange}
          futureScrollRange={futureScrollRange}
          minDate={minDate ?? undefined}
          maxDate={toLocalDateKey()}
          disableArrowLeft={isEarliest}
          disableArrowRight={isLatest}
          renderArrow={renderArrow}
          renderHeader={renderHeader}
          dayComponent={DayCell}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={calendarTheme}
        />
      </View>
    </DayCellContext.Provider>
  );
}
