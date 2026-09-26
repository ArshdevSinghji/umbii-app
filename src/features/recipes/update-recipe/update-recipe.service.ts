import { ApiResponse, http } from "@/lib/http-client";
import { UpdateRecipeRequest, UpdateRecipeResponse } from "./update-recipe.types";

export const updateRecipeService = async (request: UpdateRecipeRequest) => {
  const { userId, recipeId, ...rest } = request;
  return await http.put<ApiResponse<UpdateRecipeResponse>>(`/users/${userId}/recipes/${recipeId}`, { ...rest });
};
