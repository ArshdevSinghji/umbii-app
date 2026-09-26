export enum RecipeActionTypes {
  LIST_RECIPES = "recipes/list-recipes",
  CREATE_RECIPE = "recipes/create-recipe",
  GET_RECIPE = "recipes/get-recipe",
  UPDATE_RECIPE = "recipes/update-recipe",
  DELETE_RECIPE = "recipes/delete-recipe",
}

export interface IRecipe {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeState {
  isLoading: boolean;
  listRecipes: IRecipe[];
  selectedRecipe: IRecipe | null;
}
