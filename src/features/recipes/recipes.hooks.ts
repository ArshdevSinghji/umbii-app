import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createRecipeAction } from "./create-recipe/create-recipe.action";
import { deleteRecipeAction } from "./delete-recipe/delete-recipe.action";
import { getRecipeAction } from "./get-recipe/get-recipe.action";
import { listRecipesAction } from "./list-recipes/list-recipes.action";
import { updateRecipeAction } from "./update-recipe/update-recipe.action";

export function useRecipesActionsHook() {
  const dispatch = useAppDispatch();
  const { listRecipes, selectedRecipe, isLoading } = useAppSelector((state) => state.recipesSlice);

  const fetchRecipes = async (userId: number) => {
    await dispatch(listRecipesAction({ userId })).unwrap();
  };

  const createRecipe = async (userId: number, name: string) => {
    await dispatch(createRecipeAction({ userId, name })).unwrap();
  };

  const fetchRecipeById = async (userId: number, recipeId: number) => {
    await dispatch(getRecipeAction({ userId, recipeId })).unwrap();
  };

  const updateRecipe = async (userId: number, recipeId: number, name: string) => {
    await dispatch(updateRecipeAction({ userId, recipeId, name })).unwrap();
  };

  const deleteRecipe = async (userId: number, recipeId: number) => {
    await dispatch(deleteRecipeAction({ userId, recipeId })).unwrap();
  };

  return {
    isLoading,
    listRecipes,
    selectedRecipe,
    fetchRecipes,
    createRecipe,
    fetchRecipeById,
    updateRecipe,
    deleteRecipe,
  };
}
