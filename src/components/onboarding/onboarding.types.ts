import {
  ActivityLevel,
  Allergy,
  DietType,
  GoalType,
  HealthFlag,
  Sex,
  TrainingType,
} from "@/features/user/user.types";
import type { UserOnboardingAnswers } from "@/features/user/save-user-onboarding/save-user-onboarding.types";

// The value sets belong to the profile the backend stores; re-exported so
// the steps import everything onboarding-related from one place.
export {
  ActivityLevel,
  Allergy,
  DietType,
  GoalType,
  HealthFlag,
  Sex,
  TrainingType,
};

// Not sent: it picks the weekly rate (see getWeeklyRate).
export enum Pace {
  Slow = "slow",
  Moderate = "moderate",
  Aggressive = "aggressive",
}

// The answers while the flow is open. `null` = not answered yet; pickers
// with a sensible starting value (age, height, weight) start with one. For
// the multi-selects, `[]` means "None" was picked and `null` means nothing
// was picked yet.
export interface OnboardingValues {
  sex: Sex | null;
  // "YYYY-MM-DD", so the age is always worked out fresh.
  dateOfBirth: string | null;
  heightCm: number;
  weightKg: number;
  goalType: GoalType | null;
  // Pace screen (fat loss and hypertrophy only).
  targetWeightKg: number | null;
  pace: Pace | null;
  workoutsPerWeek: number | null;
  activityLevel: ActivityLevel | null;
  // Asked only when there's at least one workout a week.
  trainingType: TrainingType | null;
  avgSessionMinutes: number | null;
  dietType: DietType | null;
  allergies: Allergy[] | null;
  healthFlags: HealthFlag[] | null;
}

// What "Build my plan" sends (POST /users/{userId}).
export type PlanRequest = UserOnboardingAnswers;

export type StepId = "about" | "body" | "goal" | "pace" | "week" | "food";

// Oldest date of birth the picker offers, in years back from today.
export const MAX_AGE = 100;
// Below this, the flow stops with a "talk to a doctor" screen.
export const ADULT_AGE = 18;
