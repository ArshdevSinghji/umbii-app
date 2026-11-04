import type { IGeneratedNutritionTarget } from "@/features/nutrition-target/nutrition-target.types";
import type {
  ActivityLevel,
  DietType,
  GoalType,
  HealthFlag,
  IUserProfile,
  Sex,
  TrainingType,
} from "../user.types";

// Partial update of the onboarding answers: send at least one. The result
// must still pass the onboarding rules: maintenance clears target weight
// and pace, 0 workouts clears training type and session length, and fat
// loss / muscle gain need a target weight (checked against the latest
// weigh-in, -30/+20 kg, in the goal's direction) and a pace that fit.
// Allergies can't be patched; they change only by redoing onboarding.
export interface ProfileChanges {
  sex?: Sex;
  dateOfBirth?: string;
  heightCm?: number;
  goalType?: GoalType;
  targetWeightKg?: number;
  weeklyRateKg?: number;
  workoutsPerWeek?: number;
  activityLevel?: ActivityLevel;
  trainingType?: TrainingType;
  avgSessionMinutes?: number;
  dietType?: DietType;
  // Replaces the list; [] clears it.
  healthFlags?: HealthFlag[];
}

export interface PatchUserProfileRequest extends ProfileChanges {
  userId: number;
}

// Any change regenerates the nutrition target (from today), replacing the
// one in effect even if it was set by hand.
export interface PatchUserProfileResponse {
  profile: IUserProfile;
  nutritionTarget: IGeneratedNutritionTarget;
}
