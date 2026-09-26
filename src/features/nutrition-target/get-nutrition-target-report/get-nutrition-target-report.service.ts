import { ApiResponse, http } from "@/lib/http-client";
import {
  GetNutritionTargetReportRequest,
  NutritionTargetReportResponse,
} from "./get-nutrition-target-report.types";

export const getNutritionTargetReportService = async (request: GetNutritionTargetReportRequest) => {
  const { userId, params } = request;
  return await http.get<ApiResponse<NutritionTargetReportResponse>>(`/users/${userId}/nutrition-target/report`, {
    params,
  });
};
