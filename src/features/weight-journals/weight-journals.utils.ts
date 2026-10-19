import { toLocalDateKey } from "@/utils/date";
import { IWeightJournal } from "@/features/weight-journals/weight-journals.types";

export type WeightPeriod = "week" | "month";

export interface WeightChartPoint {
  date: string;
  label: string;
  // null until the user's first ever entry.
  weight: number | null;
  // Toward the goal weight; null without one (maintenance).
  progress: number | null;
  // false when the weight is carried forward from an earlier day.
  isLogged: boolean;
}

const PERIOD_DAYS: Record<WeightPeriod, number> = { week: 7, month: 30 };

const toDateKey = (value: string) => value.slice(0, 10);

// Rolling window ending today, e.g. the last 7 or 30 days.
const getWeightPeriodRange = (
  period: WeightPeriod,
  referenceDate = new Date(),
) => {
  const start = new Date(referenceDate);
  start.setDate(start.getDate() - (PERIOD_DAYS[period] - 1));

  return {
    startDate: toLocalDateKey(start),
    endDate: toLocalDateKey(referenceDate),
  };
};

const sortByDate = (journals: IWeightJournal[]) =>
  [...journals].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id,
  );

// Percentage of the way from the starting weight to the target weight.
// Works for both losing and gaining goals.
const calculateGoalProgress = (
  startWeight: number,
  currentWeight: number,
  targetWeight: number,
) => {
  const totalChange = startWeight - targetWeight;
  if (totalChange === 0) return currentWeight === targetWeight ? 100 : 0;

  const progress = ((startWeight - currentWeight) / totalChange) * 100;
  return Math.min(100, Math.max(0, progress));
};

const getProgressStatus = (progress: number) => {
  if (progress >= 75) return "Great";
  if (progress >= 50) return "Good";
  if (progress >= 25) return "Fair";
  return "Just started";
};

const formatPointLabel = (date: string, period: WeightPeriod) => {
  const parsed = new Date(`${date}T00:00:00`);

  return period === "week"
    ? parsed.toLocaleDateString(undefined, { weekday: "short" })
    : parsed.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const getDatesInRange = (startDate: string, endDate: string) => {
  const dates: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00Z`);

  while (toDateKey(cursor.toISOString()) <= endDate) {
    dates.push(toDateKey(cursor.toISOString()));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
};

// One point for every day in [startDate, endDate]. Days without an entry
// carry the last logged weight forward, so missed days draw a flat line.
// `targetWeightKg` is the profile's goal weight (null for maintenance).
const buildWeightChartPoints = (
  journals: IWeightJournal[],
  period: WeightPeriod,
  startDate: string,
  endDate: string,
  latest: IWeightJournal | null,
  targetWeightKg: number | null,
): WeightChartPoint[] => {
  const sorted = sortByDate(journals);

  // If the all-time latest entry is before the range, it's the weight in
  // effect on the range's first day — carry it in, so a period with no
  // weigh-ins still shows the current weight as a flat line.
  const carriedIn =
    latest && toDateKey(latest.createdAt) < startDate ? latest : null;

  // Progress within the period: from the weight going into it.
  const startEntry = carriedIn ?? sorted[0];
  const startWeight = startEntry ? startEntry.weightKg : 0;

  let cursor = 0;
  let lastEntry: IWeightJournal | null = carriedIn;

  return getDatesInRange(startDate, endDate).map((date) => {
    let isLogged = false;

    // Advance to the latest entry on or before this day.
    while (
      cursor < sorted.length &&
      toDateKey(sorted[cursor].createdAt) <= date
    ) {
      lastEntry = sorted[cursor];
      isLogged = toDateKey(lastEntry.createdAt) === date;
      cursor += 1;
    }

    const weight = lastEntry ? lastEntry.weightKg : null;

    return {
      date,
      label: formatPointLabel(date, period),
      weight,
      progress:
        weight !== null && targetWeightKg !== null
          ? calculateGoalProgress(startWeight, weight, targetWeightKg)
          : null,
      isLogged,
    };
  });
};

// Progress toward the goal made within the period: from the earliest weight
// in range (or the latest entry before it, if nothing was logged in range)
// to the user's latest weight. Null without a goal weight (maintenance).
const getPeriodProgress = (
  journals: IWeightJournal[],
  latest: IWeightJournal | null,
  startDate: string,
  targetWeightKg: number | null,
) => {
  if (targetWeightKg === null) return null;
  if (!latest) return 0;

  const sorted = sortByDate(journals);
  const start =
    toDateKey(latest.createdAt) < startDate ? latest : (sorted[0] ?? latest);

  return calculateGoalProgress(start.weightKg, latest.weightKg, targetWeightKg);
};

export {
  buildWeightChartPoints,
  calculateGoalProgress,
  getPeriodProgress,
  getProgressStatus,
  getWeightPeriodRange,
};
