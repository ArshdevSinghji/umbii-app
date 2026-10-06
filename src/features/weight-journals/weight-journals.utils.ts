import { IWeightJournal } from "@/features/weight-journals/weight-journals.types";

export type WeightPeriod = "week" | "month";

export interface WeightChartPoint {
  date: string;
  label: string;
  // null until the user's first ever entry.
  weight: number | null;
  progress: number | null;
  // false when the weight is carried forward from an earlier day.
  isLogged: boolean;
}

const PERIOD_DAYS: Record<WeightPeriod, number> = { week: 7, month: 30 };

const toDateKey = (value: string) => value.slice(0, 10);

// Rolling window ending today, e.g. the last 7 or 30 days.
const getWeightPeriodRange = (period: WeightPeriod, referenceDate = new Date()) => {
  const start = new Date(referenceDate);
  start.setDate(start.getDate() - (PERIOD_DAYS[period] - 1));

  return {
    startDate: toDateKey(start.toISOString()),
    endDate: toDateKey(referenceDate.toISOString()),
  };
};

const isLoggedToday = (journal: IWeightJournal) =>
  toDateKey(journal.createdAt) === toDateKey(new Date().toISOString());

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
const buildWeightChartPoints = (
  journals: IWeightJournal[],
  period: WeightPeriod,
  startDate: string,
  endDate: string,
): WeightChartPoint[] => {
  const sorted = sortByDate(journals);
  const startWeight = sorted.length ? parseFloat(sorted[0].currentWeight) : 0;

  let cursor = 0;
  let lastEntry: IWeightJournal | null = null;

  return getDatesInRange(startDate, endDate).map((date) => {
    let isLogged = false;

    // Advance to the latest entry on or before this day.
    while (cursor < sorted.length && toDateKey(sorted[cursor].createdAt) <= date) {
      lastEntry = sorted[cursor];
      isLogged = toDateKey(lastEntry.createdAt) === date;
      cursor += 1;
    }

    const weight = lastEntry ? parseFloat(lastEntry.currentWeight) : null;

    return {
      date,
      label: formatPointLabel(date, period),
      weight,
      progress:
        lastEntry && weight !== null
          ? calculateGoalProgress(
              startWeight,
              weight,
              parseFloat(lastEntry.targetWeight),
            )
          : null,
      isLogged,
    };
  });
};

// Overall progress based on the very first and the latest entries.
const getOverallProgress = (journals: IWeightJournal[]) => {
  const sorted = sortByDate(journals);
  if (sorted.length === 0) return 0;

  const first = sorted[0];
  const latest = sorted[sorted.length - 1];

  return calculateGoalProgress(
    parseFloat(first.currentWeight),
    parseFloat(latest.currentWeight),
    parseFloat(latest.targetWeight),
  );
};

export {
  buildWeightChartPoints,
  calculateGoalProgress,
  getOverallProgress,
  getProgressStatus,
  getWeightPeriodRange,
  isLoggedToday,
};
