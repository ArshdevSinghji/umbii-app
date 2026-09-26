import { ApiResponse, http } from "@/lib/http-client";
import { CreateRecipeRequest, CreateRecipeResponse } from "./create-recipe.types";

export const createRecipeService = async (request: CreateRecipeRequest) => {
  const { userId, ...rest } = request;
  return await http.post<ApiResponse<CreateRecipeResponse>>(`/users/${userId}/recipes`, { ...rest });
};
