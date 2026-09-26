import { ApiResponse, http } from "@/lib/http-client";
import { NutritionTargetResponse } from "../create-nutrition-target/create-nutrition-target.types";
import { GetNutritionTargetRequest } from "./get-nutrition-target.types";

export const getNutritionTargetService = async (request: GetNutritionTargetRequest) => {
  const { userId, params } = request;
  return await http.get<ApiResponse<NutritionTargetResponse>>(`/users/${userId}/nutrition-target`, { params });
};
