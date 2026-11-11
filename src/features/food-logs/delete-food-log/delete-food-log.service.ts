import { ApiResponse, http } from "@/lib/http-client";
import {
  DeleteFoodLogRequest,
  DeleteFoodLogResponse,
} from "./delete-food-log.types";

export const deleteFoodLogService = async (request: DeleteFoodLogRequest) => {
  const { userId, foodLogId } = request;
  return await http.delete<ApiResponse<DeleteFoodLogResponse>>(
    `/users/${userId}/food-logs/${foodLogId}`,
  );
};
