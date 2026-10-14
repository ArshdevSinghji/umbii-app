import { IFoodLogDetail } from "@/features/food-logs/food-logs.types";
import { IRecipe } from "../recipes.types";

export interface CreateRecipeRequest {
  userId: number;
  // Trimmed, non-blank (the server rejects whitespace-only names).
  name: string;
  // The logged meal to save; each log can be saved as a recipe once (409).
  foodLogId: number;
  // Client-only, never sent: the meal's items, attached to the new recipe
  // in the list because the create response doesn't include them.
  details?: IFoodLogDetail[];
}

export type CreateRecipeResponse = IRecipe;
