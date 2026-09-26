import { IRecipe } from "../recipes.types";

export interface CreateRecipeRequest {
  userId: number;
  name: string;
}

export type CreateRecipeResponse = IRecipe;
