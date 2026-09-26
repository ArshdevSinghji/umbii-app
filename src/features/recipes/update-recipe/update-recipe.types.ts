import { IRecipe } from "../recipes.types";

export interface UpdateRecipeRequest {
  userId: number;
  recipeId: number;
  name: string;
}

export type UpdateRecipeResponse = IRecipe;
