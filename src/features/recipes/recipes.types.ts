import { IFoodLogDetail } from "@/features/food-logs/food-logs.types";

export enum RecipeActionTypes {
  LIST_RECIPES = "recipes/list-recipes",
  CREATE_RECIPE = "recipes/create-recipe",
  GET_RECIPE = "recipes/get-recipe",
  UPDATE_RECIPE = "recipes/update-recipe",
  DELETE_RECIPE = "recipes/delete-recipe",
}

// One of a recipe's own items: copied from the meal it was saved from, so
// editing either later doesn't change the other. Same fields as a food-log
// detail, but `id` is a recipe-item id — never use it as a food-log id.
export type IRecipeItem = IFoodLogDetail;

// A named set of items that can be logged as a meal any number of times.
// Names aren't unique — key by id. There are no totals: sum each macro across
// `details` (calculateNutrition). GET /recipes has no fixed order; sort by
// createdAt then id, newest first.
export interface IRecipe {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;  
  // The recipe's own items. On list, get and create responses; an update
  // (rename) keeps the ones already loaded.
  details: IRecipeItem[];
}

export interface RecipeState {
  isLoading: boolean;
  listRecipes: IRecipe[];
  selectedRecipe: IRecipe | null;
}
