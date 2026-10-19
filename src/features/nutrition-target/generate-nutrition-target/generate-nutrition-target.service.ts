import { ApiResponse, http } from "@/lib/http-client";
import {
  GenerateNutritionTargetRequest,
  GenerateNutritionTargetResponse,
} from "./generate-nutrition-target.types";

// No body: works out a new target from the profile and the latest weigh-in,
// in effect from today (earlier targets are kept). 404 without a profile,
// 400 without a weigh-in.
export const generateNutritionTargetService = async (
  request: GenerateNutritionTargetRequest,
) => {
  const { userId } = request;
  return await http.post<ApiResponse<GenerateNutritionTargetResponse>>(
    `/users/${userId}/nutrition-target/generate`,
    // No body; the client's post always sends one, so an empty object.
    {},
  );
};
