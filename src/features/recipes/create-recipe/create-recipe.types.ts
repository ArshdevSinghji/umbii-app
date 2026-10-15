import { IRecipe } from "../recipes.types";

export interface CreateRecipeRequest {
  userId: number;
  // Trimmed, non-blank (the server rejects whitespace-only names).
  name: string;
  // The logged meal to save. Its items are copied into the recipe and the
  // log gets the new recipeId. 409 if the log is already linked to a recipe
  // (saved as one, or eaten from one).
  foodLogId: number;
}

export type CreateRecipeResponse = IRecipe;
