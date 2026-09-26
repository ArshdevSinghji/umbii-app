import { IRecipe } from "../recipes.types";

export interface GetRecipeRequest {
  userId: number;
  recipeId: number;
}

export type GetRecipeResponse = IRecipe;
