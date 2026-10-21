import type { IGeneratedNutritionTarget } from "@/features/nutrition-target/nutrition-target.types";
import type { IUserProfile } from "../user.types";

// Partial update: send at least one. Target weight isn't allowed for
// maintenance, and must be below the latest weigh-in for fat loss (above
// for muscle gain), within -30/+20 kg.
export interface PatchUserProfileRequest {
  userId: number;
  heightCm?: number;
  targetWeightKg?: number;
}

// Either change regenerates the nutrition target (from today), replacing
// the one in effect even if it was set by hand.
export interface PatchUserProfileResponse {
  profile: IUserProfile;
  nutritionTarget: IGeneratedNutritionTarget;
}
