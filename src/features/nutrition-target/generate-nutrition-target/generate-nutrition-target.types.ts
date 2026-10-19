import { IGeneratedNutritionTarget } from "../nutrition-target.types";

export interface GenerateNutritionTargetRequest {
  userId: number;
}

export type GenerateNutritionTargetResponse = IGeneratedNutritionTarget;
