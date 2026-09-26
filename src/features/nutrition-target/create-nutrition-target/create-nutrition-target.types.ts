import { NutritionValues } from "@/features/food-logs/food-logs.types";

export interface NutritionTargetRequest extends NutritionValues {
  userId: number;
}

export interface NutritionTargetResponse extends NutritionValues {
  id: number;
  createdAt: string;
  updatedAt: string;
}
