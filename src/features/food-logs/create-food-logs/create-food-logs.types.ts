import { IFoodLog, IFoodLogDetail } from "../food-logs.types";

export interface CreateFoodLogsRequest {
  userId: number;
  rawInputText: string;
  details: Omit<IFoodLogDetail, "id" | "createdAt" | "updatedAt">[];
  // Logging a recipe as a meal: links the new log to it (404 if the recipe
  // is gone or not the user's). Left out for a normal meal.
  recipeId?: number;
}

// The saved log, same shape as GET /food-logs/{id}; recipeId is set when it
// was logged from a recipe, null otherwise.
export type CreateFoodLogsResponse = IFoodLog;
