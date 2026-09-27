import { ApiResponse, http } from "@/lib/http-client";
import { GetFoodLogRequest, GetFoodLogResponse } from "./get-food-log.types";

export const getFoodLogService = async (request: GetFoodLogRequest) => {
  const { userId, foodLogId } = request;
  return await http.get<ApiResponse<GetFoodLogResponse>>(`/users/${userId}/food-logs/${foodLogId}`);
};
