import { ApiResponse, http } from "@/lib/http-client";
import { CreateFoodLogsRequest, CreateFoodLogsResponse } from "./create-food-logs.types";

export const createFoodLogsService = async (request: CreateFoodLogsRequest) => {
  const { userId, rawInputText, details } = request;
  return await http.post<ApiResponse<CreateFoodLogsResponse>>(`/users/${userId}/food-logs`, { rawInputText, details });
};
