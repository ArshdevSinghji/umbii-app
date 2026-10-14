import { toLocalDateKey } from "@/utils/date";

// "yyyy-MM" of the current month, in local time.
export const getCurrentMonth = () => toLocalDateKey().slice(0, 7);

// Shifts a "yyyy-MM" month by `delta` months.
export const shiftMonth = (month: string, delta: number) => {
  const [year, monthIndex] = month.split("-").map(Number);
  return toLocalDateKey(new Date(year, monthIndex - 1 + delta, 1)).slice(0, 7);
};

// "October 2026"
export const formatMonthTitle = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(year, monthIndex - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

// Report range for a month: the 1st to its last day, or today if sooner.
export const getMonthReportRange = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const startDate = toLocalDateKey(new Date(year, monthIndex - 1, 1));
  const lastOfMonth = toLocalDateKey(new Date(year, monthIndex, 0));
  const today = toLocalDateKey();
  return { startDate, endDate: today < lastOfMonth ? today : lastOfMonth };
};

export type DayStatus = "completed" | "incomplete" | "none";
