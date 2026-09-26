import { ApiResponse, http } from "@/lib/http-client";
import { GetRecipeRequest, GetRecipeResponse } from "./get-recipe.types";

export const getRecipeService = async (request: GetRecipeRequest) => {
  const { userId, recipeId } = request;
  return await http.get<ApiResponse<GetRecipeResponse>>(`/users/${userId}/recipes/${recipeId}`);
};
