import { ApiResponse, http } from "@/lib/http-client";
import { DeleteRecipeRequest, DeleteRecipeResponse } from "./delete-recipe.types";

export const deleteRecipeService = async (request: DeleteRecipeRequest) => {
  const { userId, recipeId } = request;
  return await http.delete<ApiResponse<DeleteRecipeResponse>>(`/users/${userId}/recipes/${recipeId}`);
};
