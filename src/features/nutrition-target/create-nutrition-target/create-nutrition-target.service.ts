import { ApiResponse, http } from "@/lib/http-client";
import { NutritionTargetRequest, NutritionTargetResponse } from "./create-nutrition-target.types";

export const createNutritionTargetService = async (request: NutritionTargetRequest) => {
  const { userId, ...rest } = request;
  return await http.post<ApiResponse<NutritionTargetResponse>>(`/users/${userId}/nutrition-target`, { ...rest });
};
