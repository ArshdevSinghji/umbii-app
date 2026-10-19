import type { IGeneratedNutritionTarget } from "@/features/nutrition-target/nutrition-target.types";
import type {
  ActivityLevel,
  Allergy,
  DietType,
  GoalType,
  HealthFlag,
  Sex,
  TrainingType,
} from "../user.types";

// The onboarding answers (POST /users/{userId}, an upsert). Conditional
// fields are left out, not sent as null.
export interface UserOnboardingAnswers {
  sex: Sex;
  // "YYYY-MM-DD"; the server checks age 18-100.
  dateOfBirth: string;
  heightCm: number;
  weightKg: number;
  goalType: GoalType;
  // Not for maintenance.
  targetWeightKg?: number;
  // kg per week, negative for loss. Not for maintenance.
  weeklyRateKg?: number;
  workoutsPerWeek: number;
  activityLevel: ActivityLevel;
  // Only with at least one workout a week.
  trainingType?: TrainingType;
  avgSessionMinutes?: number;
  dietType: DietType;
  // Empty when "None".
  allergies: Allergy[];
  healthFlags: HealthFlag[];
}

export interface SaveUserOnboardingRequest extends UserOnboardingAnswers {
  userId: number;
}

// The first nutrition target, generated from the answers.
export type SaveUserOnboardingResponse = IGeneratedNutritionTarget;
