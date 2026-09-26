import { ApiResponse, http } from "@/lib/http-client";
import { IRecipe } from "../recipes.types";
import { ListRecipesRequest } from "./list-recipes.types";

export const listRecipesService = async (request: ListRecipesRequest) => {
  const { userId } = request;
  return await http.get<ApiResponse<IRecipe[]>>(`/users/${userId}/recipes`);
};
