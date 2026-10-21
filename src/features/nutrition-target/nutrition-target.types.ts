import type { NutritionValues } from "@/features/food-logs/food-logs.types";
import type { GoalType } from "@/features/user/user.types";
import type { NutritionTargetResponse } from "./create-nutrition-target/create-nutrition-target.types";
import type { NutritionTargetReportResponse } from "./get-nutrition-target-report/get-nutrition-target-report.types";

export enum NutritionTargetActionTypes {
  GENERATE_NUTRITION_TARGET = "GENERATE_NUTRITION_TARGET",
  CREATE_NUTRITION_TARGET = "CREATE_NUTRITION_TARGET",
  GET_NUTRITION_TARGET = "GET_NUTRITION_TARGET",
  GET_NUTRITION_TARGET_REPORT = "GET_NUTRITION_TARGET_REPORT",
  GET_PERIOD_NUTRITION_TARGET = "GET_PERIOD_NUTRITION_TARGET",
  GET_CALENDAR_NUTRITION_TARGET_REPORT = "GET_CALENDAR_NUTRITION_TARGET_REPORT",
}

// Where a target came from: worked out from the profile, or set by hand.
export enum TargetSource {
  Generated = "GENERATED",
  Manual = "MANUAL",
}

// A target generated from the profile, plus how it was worked out: saving
// the onboarding answers and POST /nutrition-target/generate return this,
// and so does GET /nutrition-target when the target in effect was generated.
export interface IGeneratedNutritionTarget extends NutritionValues {
  id: number;
  source: TargetSource.Generated;
  formulaVersion: string;
  // The weight it was computed from (the latest weigh-in).
  weightKg: number;
  bmr: number;
  maintenanceCalories: number;
  // Usually the profile's goal; maintenance when the target weight is
  // reached or a safety rule rules out a deficit.
  goal: GoalType;
  // Safety rules that changed the result, in plain language.
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NutritionTargetState {
  // Recalculating the plan from the profile.
  isGenerating: boolean;
  isLoading: boolean;
  isReportLoading: boolean;
  // What the last target / report request asked for. Repeating the same
  // request (a refresh) updates quietly instead of showing loading again.
  targetQuery: string | null;
  reportQuery: string | null;
  // Breakdown's own copies, kept apart so they never replace Home's daily
  // target and week report: the selected period's target totals, and the
  // calendar month's report.
  periodNutritionTarget: NutritionTargetResponse | null;
  isPeriodTargetLoading: boolean;
  periodTargetQuery: string | null;
  calendarReport: NutritionTargetReportResponse | null;
  isCalendarReportLoading: boolean;
  calendarReportQuery: string | null;
  nutritionTarget: NutritionTargetResponse | null;
  report: NutritionTargetReportResponse | null;
}
