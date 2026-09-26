import { createSlice } from "@reduxjs/toolkit";
import { createRecipeAction } from "./create-recipe/create-recipe.action";
import { deleteRecipeAction } from "./delete-recipe/delete-recipe.action";
import { getRecipeAction } from "./get-recipe/get-recipe.action";
import { listRecipesAction } from "./list-recipes/list-recipes.action";
import { RecipeState } from "./recipes.types";
import { updateRecipeAction } from "./update-recipe/update-recipe.action";

const initialState: RecipeState = {
  isLoading: false,
  listRecipes: [],
  selectedRecipe: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listRecipesAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listRecipesAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRecipes = action.payload;
      })
      .addCase(listRecipesAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createRecipeAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRecipeAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRecipes.push(action.payload);
      })
      .addCase(createRecipeAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getRecipeAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecipeAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRecipe = action.payload;
      })
      .addCase(getRecipeAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateRecipeAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRecipeAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRecipe = action.payload;
        state.listRecipes = state.listRecipes.map((recipe) =>
          recipe.id === action.payload.id ? action.payload : recipe,
        );
      })
      .addCase(updateRecipeAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteRecipeAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRecipeAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRecipes = state.listRecipes.filter((recipe) => recipe.id !== action.payload);
        if (state.selectedRecipe?.id === action.payload) {
          state.selectedRecipe = null;
        }
      })
      .addCase(deleteRecipeAction.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {} = recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
