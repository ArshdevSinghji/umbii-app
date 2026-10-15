import type { NutritionTargetResponse } from "./create-nutrition-target/create-nutrition-target.types";
import type { NutritionTargetReportResponse } from "./get-nutrition-target-report/get-nutrition-target-report.types";

export enum NutritionTargetActionTypes {
  CREATE_NUTRITION_TARGET = "CREATE_NUTRITION_TARGET",
  GET_NUTRITION_TARGET = "GET_NUTRITION_TARGET",
  GET_NUTRITION_TARGET_REPORT = "GET_NUTRITION_TARGET_REPORT",
  GET_PERIOD_NUTRITION_TARGET = "GET_PERIOD_NUTRITION_TARGET",
  GET_CALENDAR_NUTRITION_TARGET_REPORT = "GET_CALENDAR_NUTRITION_TARGET_REPORT",
}

export interface NutritionTargetState {
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
