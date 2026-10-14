import { IFoodLogDetail } from "@/features/food-logs/food-logs.types";

export enum RecipeActionTypes {
  LIST_RECIPES = "recipes/list-recipes",
  CREATE_RECIPE = "recipes/create-recipe",
  GET_RECIPE = "recipes/get-recipe",
  UPDATE_RECIPE = "recipes/update-recipe",
  DELETE_RECIPE = "recipes/delete-recipe",
}

// A name attached to a logged meal. Names aren't unique — key by id. There
// are no totals: sum each macro across `details` (calculateNutrition).
// GET /recipes has no fixed order; sort by createdAt then id, newest first.
export interface IRecipe {
  id: number;
  name: string;
  foodLogId: number;
  createdAt: string;
  updatedAt: string;
  // The food log's items. Present on GET /recipes and GET /recipes/{id};
  // not on create / update responses.
  details?: IFoodLogDetail[];
}

export interface RecipeState {
  isLoading: boolean;
  listRecipes: IRecipe[];
  selectedRecipe: IRecipe | null;
}
