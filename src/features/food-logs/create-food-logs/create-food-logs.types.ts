import { IFoodLog, IFoodLogDetail } from "../food-logs.types";

export interface CreateFoodLogsRequest {
  userId: number;
  rawInputText: string;
  details: Omit<IFoodLogDetail, "id" | "createdAt" | "updatedAt">[];
}

// The saved log, same shape as GET /food-logs/{id} (recipeId is null).
export type CreateFoodLogsResponse = IFoodLog;
