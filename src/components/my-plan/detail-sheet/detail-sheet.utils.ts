import {
  ADULT_AGE,
  GoalType,
  OnboardingValues,
  Pace,
} from "@/components/onboarding/onboarding.types";
import {
  getAge,
  getTargetWeightRange,
  getWeeklyRate,
} from "@/components/onboarding/onboarding.utils";
import type { ProfileChanges } from "@/features/user/patch-user-profile/patch-user-profile.types";
import type { DietType, IUserProfile } from "@/features/user/user.types";

// The onboarding answers plus diet, which only the Plan screen asks.
export type PlanDraft = OnboardingValues & { dietType: DietType | null };

// One row of "Your details", each edited in its own sheet. Weight is a
// weigh-in; the rest are profile answers (PATCH /profile). Allergies can't
// be patched, so they aren't here.
export type DetailField =
  | "goal"
  | "targetWeight"
  | "pace"
  | "weight"
  | "height"
  | "sex"
  | "dateOfBirth"
  | "workouts"
  | "trainingType"
  | "session"
  | "activity"
  | "diet"
  | "health";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toOneDecimal = (value: number) => Number(value.toFixed(1));

// The pace whose weekly rate the profile has (null for maintenance).
const toPace = (goalType: GoalType, weeklyRateKg: number | null) => {
  if (goalType === GoalType.Maintenance || weeklyRateKg == null) return null;
  const rate = Math.abs(weeklyRateKg);
  return (
    Object.values(Pace).find(
      (pace) => getWeeklyRate(goalType, pace) === rate,
    ) ?? null
  );
};

// The saved answers as a draft the pickers edit. `weightKg` is the latest
// weigh-in: the target weight is checked against it.
export const toDraft = (
  profile: IUserProfile,
  weightKg: number,
): PlanDraft => ({
  sex: profile.sex,
  dateOfBirth: profile.dateOfBirth,
  heightCm: profile.heightCm,
  weightKg,
  goalType: profile.goalType,
  targetWeightKg: profile.targetWeightKg,
  pace: toPace(profile.goalType, profile.weeklyRateKg),
  workoutsPerWeek: profile.workoutsPerWeek,
  activityLevel: profile.activityLevel,
  trainingType: profile.trainingType,
  avgSessionMinutes: profile.avgSessionMinutes,
  dietType: profile.dietType,
  healthFlags: profile.healthFlags,
});

// Target weight, kept inside the ruler's range around the current weight
// on the goal's side.
export const getTargetWeight = (draft: OnboardingValues) => {
  const range = getTargetWeightRange(
    draft.weightKg,
    draft.goalType ?? undefined,
  );
  return clamp(draft.targetWeightKg ?? draft.weightKg, range.min, range.max);
};

// Switching goal (or 0 → some workouts) brings in answers the profile
// doesn't have yet; the sheet asks for those too.
export const needsPace = (draft: OnboardingValues) =>
  !!draft.goalType && draft.goalType !== GoalType.Maintenance;

export const needsTraining = (draft: OnboardingValues) =>
  (draft.workoutsPerWeek ?? 0) > 0;

// What's still needed before Save, or null.
export const getMissing = (
  field: DetailField,
  draft: PlanDraft,
): string | null => {
  switch (field) {
    case "goal":
      return needsPace(draft) && !draft.pace ? "Pick a pace to save" : null;
    case "dateOfBirth":
      return draft.dateOfBirth && getAge(draft.dateOfBirth) < ADULT_AGE
        ? `Plans are for ${ADULT_AGE} and over`
        : null;
    case "workouts":
      return needsTraining(draft) &&
        (!draft.trainingType || draft.avgSessionMinutes === null)
        ? "Pick a training type and session length"
        : null;
    case "diet":
      return draft.dietType === null ? "Pick a diet to save" : null;
    case "health":
      return draft.healthFlags === null ? "Pick one, or none of these" : null;
    default:
      return null;
  }
};

// The PATCH body for a field. Goal and workouts send what comes with them,
// so the result is a valid profile (the server clears what maintenance or
// 0 workouts rule out). Only called once getMissing is null.
export const toProfileChanges = (
  field: Exclude<DetailField, "weight">,
  draft: PlanDraft,
): ProfileChanges => {
  const signedRate = () => {
    const goalType = draft.goalType as Exclude<GoalType, GoalType.Maintenance>;
    const rate = getWeeklyRate(goalType, draft.pace!);
    return goalType === GoalType.FatLoss ? -rate : rate;
  };

  switch (field) {
    case "goal":
      return needsPace(draft)
        ? {
            goalType: draft.goalType!,
            targetWeightKg: toOneDecimal(getTargetWeight(draft)),
            weeklyRateKg: signedRate(),
          }
        : { goalType: draft.goalType! };
    case "targetWeight":
      return { targetWeightKg: toOneDecimal(getTargetWeight(draft)) };
    case "pace":
      return { weeklyRateKg: signedRate() };
    case "height":
      return { heightCm: Math.round(draft.heightCm) };
    case "sex":
      return { sex: draft.sex! };
    case "dateOfBirth":
      return { dateOfBirth: draft.dateOfBirth! };
    case "workouts":
      return {
        workoutsPerWeek: draft.workoutsPerWeek!,
        ...(needsTraining(draft) && {
          trainingType: draft.trainingType!,
          avgSessionMinutes: draft.avgSessionMinutes!,
        }),
      };
    case "trainingType":
      return { trainingType: draft.trainingType! };
    case "session":
      return { avgSessionMinutes: draft.avgSessionMinutes! };
    case "activity":
      return { activityLevel: draft.activityLevel! };
    case "diet":
      return { dietType: draft.dietType! };
    case "health":
      return { healthFlags: draft.healthFlags! };
  }
};

// Same arrays in any order count as the same answer.
export const isSameChange = (a: unknown, b: unknown) => {
  const toComparable = (value: unknown) =>
    JSON.stringify(value, (_, v) => (Array.isArray(v) ? [...v].sort() : v));
  return toComparable(a) === toComparable(b);
};
