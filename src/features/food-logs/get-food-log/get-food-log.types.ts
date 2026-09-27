import { IFoodLog } from "../food-logs.types";

export interface GetFoodLogRequest {
  userId: number;
  foodLogId: number;
}

export type GetFoodLogResponse = IFoodLog;
