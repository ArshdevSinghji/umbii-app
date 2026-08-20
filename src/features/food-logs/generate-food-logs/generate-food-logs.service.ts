import { ApiResponse, http } from "@/lib/http-client";
import { GenerateFoodLogsRequest, GenerateFoodLogsResponse } from "./generate-food-logs.types";

export const generateFoodLogsService = async (request: GenerateFoodLogsRequest) => {
  const { userId, rawInputText } = request;
  return await http.post<ApiResponse<GenerateFoodLogsResponse>>(`/users/${userId}/food-logs/generate`, { rawInputText });
};
