import { NutritionValues } from "@/features/food-logs/food-logs.types";
import { GoalType } from "../nutrition-target.types";

export interface NutritionTargetRequest extends NutritionValues {
  userId: string;
  goalType: GoalType;
  startDate: string;
  endDate: string;
}

export interface NutritionTargetResponse extends NutritionTargetRequest {
  id: string;
}
