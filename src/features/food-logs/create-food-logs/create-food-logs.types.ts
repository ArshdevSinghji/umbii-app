import { IFoodLogDetail } from "../food-logs.types";

export interface CreateFoodLogsRequest {
  userId: number;
  rawInputText: string;
  details: Omit<IFoodLogDetail, "id" | "createdAt" | "updatedAt">[];
}

export interface CreateFoodLogsResponse {
  message: string;
}
