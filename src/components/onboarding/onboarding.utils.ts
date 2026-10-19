import {
  GoalType,
  OnboardingValues,
  Pace,
  PlanRequest,
  StepId,
} from "./onboarding.types";

// kg per week, by goal and pace.
const WEEKLY_RATE: Record<
  Exclude<GoalType, GoalType.Maintenance>,
  Record<Pace, number>
> = {
  [GoalType.FatLoss]: {
    [Pace.Slow]: 0.25,
    [Pace.Moderate]: 0.5,
    [Pace.Aggressive]: 0.75,
  },
  [GoalType.Hypertrophy]: {
    [Pace.Slow]: 0.1,
    [Pace.Moderate]: 0.25,
    [Pace.Aggressive]: 0.4,
  },
};

export const getWeeklyRate = (goalType: GoalType, pace: Pace) =>
  goalType === GoalType.Maintenance ? 0 : WEEKLY_RATE[goalType][pace];

// The question screens in order. The pace screen is skipped for
// maintenance; until a goal is picked it counts, so the total is 6.
export const getSteps = (goalType: GoalType | null): StepId[] =>
  goalType === GoalType.Maintenance
    ? ["about", "body", "goal", "week", "food"]
    : ["about", "body", "goal", "pace", "week", "food"];

// Target weight ruler: current weight -30 to +20 kg.
export const getTargetWeightRange = (weightKg: number) => ({
  min: Math.max(30, Math.round(weightKg - 30)),
  max: Math.min(200, Math.round(weightKg + 20)),
  step: 0.1,
});

// Age in whole years today, from a "YYYY-MM-DD" date of birth.
export const getAge = (dateOfBirth: string, today = new Date()) => {
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const hadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  return today.getFullYear() - year - (hadBirthday ? 0 : 1);
};

// The date picker works in UTC midnights (Material's selectedDateMillis),
// so dates go to and from it in UTC: no day shifts in any time zone.
export const toPickerDate = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const fromPickerDate = (date: Date) =>
  [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");

// Turns the finished answers into the request. Only called once every
// required step is answered, so the nullable fields are set.
export const toPlanRequest = (values: OnboardingValues): PlanRequest => {
  const goalType = values.goalType!;
  const hasPace = goalType !== GoalType.Maintenance;
  const trains = (values.workoutsPerWeek ?? 0) > 0;
  const rate = hasPace ? getWeeklyRate(goalType, values.pace!) : 0;

  return {
    sex: values.sex!,
    dateOfBirth: values.dateOfBirth!,
    heightCm: values.heightCm,
    weightKg: values.weightKg,
    goalType,
    ...(hasPace && {
      targetWeightKg: values.targetWeightKg ?? values.weightKg,
      weeklyRateKg: goalType === GoalType.FatLoss ? -rate : rate,
    }),
    workoutsPerWeek: values.workoutsPerWeek!,
    activityLevel: values.activityLevel!,
    ...(trains && {
      trainingType: values.trainingType!,
      avgSessionMinutes: values.avgSessionMinutes!,
    }),
    dietType: values.dietType!,
    allergies: values.allergies ?? [],
    healthFlags: values.healthFlags ?? [],
  };
};
