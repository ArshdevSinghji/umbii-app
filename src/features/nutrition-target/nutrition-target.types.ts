import type { NutritionTargetResponse } from "./create-nutrition-target/create-nutrition-target.types";
import type { NutritionTargetReportResponse } from "./get-nutrition-target-report/get-nutrition-target-report.types";

export enum NutritionTargetActionTypes {
  CREATE_NUTRITION_TARGET = "CREATE_NUTRITION_TARGET",
  GET_NUTRITION_TARGET = "GET_NUTRITION_TARGET",
  GET_NUTRITION_TARGET_REPORT = "GET_NUTRITION_TARGET_REPORT",
}

export interface NutritionTargetState {
  isLoading: boolean;
  nutritionTarget: NutritionTargetResponse | null;
  report: NutritionTargetReportResponse | null;
}
