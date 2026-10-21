import { NutritionValues } from "@/features/food-logs/food-logs.types";
import type { GoalType } from "@/features/user/user.types";
import type { TargetSource } from "../nutrition-target.types";

export interface NutritionTargetRequest extends NutritionValues {
  userId: number;
}

// Single target (no params / `date`): that day's macro budget.
// Range (`dateRange.*`): macro values are TOTALS for the covered days —
// each day adds the target in effect that day; days after today don't count.
export interface NutritionTargetResponse extends NutritionValues {
  id: number;
  createdAt: string;
  updatedAt: string;
  // Range only: first covered day — the later of the requested start and the
  // user's first target. Coverage always runs from here to today.
  startDate?: string;
  // Range only: number of covered days. Average daily target = total / this.
  targetDays?: number;
  // Single target only. How it was worked out, for a generated target; all
  // null for a manual one (see isGeneratedTarget).
  source?: TargetSource | null;
  formulaVersion?: string | null;
  weightKg?: number | null;
  bmr?: number | null;
  maintenanceCalories?: number | null;
  goal?: GoalType | null;
  notes?: string[] | null;
}
