import {
  IGeneratedNutritionTarget,
  TargetSource,
} from "./nutrition-target.types";
import { NutritionTargetResponse } from "./create-nutrition-target/create-nutrition-target.types";

// A generated target carries how it was worked out (resting burn,
// maintenance, goal, notes); a manual one has only the numbers.
export const isGeneratedTarget = (
  target: NutritionTargetResponse | IGeneratedNutritionTarget | null,
): target is IGeneratedNutritionTarget =>
  !!target &&
  target.source === TargetSource.Generated &&
  target.bmr != null &&
  target.maintenanceCalories != null &&
  target.weightKg != null &&
  target.goal != null;
