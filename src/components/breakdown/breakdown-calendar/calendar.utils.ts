import { StatsPeriod } from "@/utils/get-date-range-for-period";
import { parseLocalDateKey, toLocalDateKey } from "@/utils/date";

export type DayStatus = "completed" | "incomplete" | "none";

// Weeks start on Monday, in the calendar and in the "Weekly" range.
export const FIRST_DAY = 1;

const minKey = (a: string, b: string) => (a < b ? a : b);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
};

// Monday of the week the day falls in.
const startOfWeek = (date: Date) =>
  addDays(date, -((date.getDay() - FIRST_DAY + 7) % 7));

// The account's first day ("yyyy-MM-dd", local), or null if unknown.
// `createdAt` may be a plain date or a full timestamp.
export const getAccountStartDate = (createdAt?: string | null) => {
  if (!createdAt) return null;
  return createdAt.length === 10
    ? createdAt
    : toLocalDateKey(new Date(createdAt));
};

// The days Breakdown covers for a period around the picked day: the day
// itself, its Mon–Sun week, its month or its year, never past today nor
// before the account existed (`minDate`).
export const getBreakdownRange = (
  period: StatsPeriod,
  selectedDate: string,
  minDate?: string | null,
) => {
  const date = parseLocalDateKey(selectedDate);
  const year = date.getFullYear();
  const month = date.getMonth();

  const [start, end] =
    period === "week"
      ? [startOfWeek(date), addDays(startOfWeek(date), 6)]
      : period === "month"
        ? [new Date(year, month, 1), new Date(year, month + 1, 0)]
        : period === "year"
          ? [new Date(year, 0, 1), new Date(year, 11, 31)]
          : [date, date];

  const startDate = toLocalDateKey(start);
  return {
    startDate: minDate && minDate > startDate ? minDate : startDate,
    endDate: minKey(toLocalDateKey(end), toLocalDateKey()),
  };
};

// "8 Oct", "6 – 12 Oct", "October 2026", "2026".
export const formatBreakdownRange = (
  period: StatsPeriod,
  startDate: string,
  endDate: string,
) => {
  const start = parseLocalDateKey(startDate);
  const end = parseLocalDateKey(endDate);
  const dayMonth = (date: Date) =>
    date.toLocaleDateString(undefined, { day: "numeric", month: "short" });

  if (period === "year") return String(start.getFullYear());
  if (period === "month")
    return start.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  if (period === "week")
    return start.getMonth() === end.getMonth()
      ? `${start.getDate()} – ${dayMonth(end)}`
      : `${dayMonth(start)} – ${dayMonth(end)}`;
  return dayMonth(start);
};

// Everything the month grid shows, including the other months' days that
// fill its first and last rows (so any week strip inside the month), so
// those days get their dots too. Never past today.
export const getMonthGridReportRange = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const first = new Date(year, monthIndex - 1, 1);
  const last = new Date(year, monthIndex, 0);
  return {
    startDate: toLocalDateKey(startOfWeek(first)),
    endDate: minKey(
      toLocalDateKey(addDays(startOfWeek(last), 6)),
      toLocalDateKey(),
    ),
  };
};

// Whole months from `from` to `to` ("yyyy-MM-dd"; `to` defaults to today).
export const monthsBetween = (from: string, to = toLocalDateKey()) => {
  const start = parseLocalDateKey(from);
  const end = parseLocalDateKey(to);
  return Math.max(
    0,
    (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth(),
  );
};

// Whether paging back from the visible day would only show days before the
// account existed: the month (open) or week strip (closed) already holds it.
export const isAtEarliestPage = (
  visibleDate: string,
  isOpen: boolean,
  minDate: string | null,
) => {
  if (!minDate) return false;
  if (isOpen) return visibleDate.slice(0, 7) <= minDate.slice(0, 7);
  return (
    toLocalDateKey(startOfWeek(parseLocalDateKey(visibleDate))) <=
    toLocalDateKey(startOfWeek(parseLocalDateKey(minDate)))
  );
};

// Whether paging forward from the visible day would only show the future:
// the month (open calendar) or the week strip (closed) already holds today.
export const isAtLatestPage = (visibleDate: string, isOpen: boolean) => {
  const today = new Date();
  const date = parseLocalDateKey(visibleDate);
  if (isOpen) {
    return (
      date.getFullYear() * 12 + date.getMonth() >=
      today.getFullYear() * 12 + today.getMonth()
    );
  }
  return (
    toLocalDateKey(startOfWeek(date)) >= toLocalDateKey(startOfWeek(today))
  );
};
