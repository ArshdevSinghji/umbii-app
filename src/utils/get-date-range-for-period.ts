import { toLocalDateKey } from "@/utils/date";
export type StatsPeriod = "day" | "week" | "month" | "year";

export function getDateRangeForPeriod(
  period: StatsPeriod,
  referenceDate = new Date(),
): { startDate: string; endDate: string } {
  const endDate = toLocalDateKey(referenceDate);

  const start = new Date(referenceDate);

  switch (period) {
    case "day":
      break;
    case "week":
      start.setDate(start.getDate() - 6);
      break;
    case "month":
      start.setDate(1);
      break;
    case "year":
      start.setMonth(0, 1);
      break;
  }

  return { startDate: toLocalDateKey(start), endDate };
}

export function getDaysInRange(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return Math.max(1, diff + 1);
}
