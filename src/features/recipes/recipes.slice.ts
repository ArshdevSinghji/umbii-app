import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createRecipeAction } from "./create-recipe/create-recipe.action";
import { deleteRecipeAction } from "./delete-recipe/delete-recipe.action";
import { getRecipeAction } from "./get-recipe/get-recipe.action";
import { listRecipesAction } from "./list-recipes/list-recipes.action";
import { IRecipe, RecipeState } from "./recipes.types";
import { updateRecipeAction } from "./update-recipe/update-recipe.action";

// No guaranteed order from the API: newest first, by createdAt then id.
const sortNewestFirst = (recipes: IRecipe[]) =>
  [...recipes].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id,
  );

const initialState: RecipeState = {
  isLoading: false,
  listRecipes: [],
  selectedRecipe: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    // Drop a recipe the server says is gone (404) without a delete call.
    removeRecipe: (state, action: PayloadAction<number>) => {
      state.listRecipes = state.listRecipes.filter(
        (recipe) => recipe.id !== action.payload,
      );
      if (state.selectedRecipe?.id === action.payload)
        state.selectedRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listRecipesAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listRecipesAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRecipes = sortNewestFirst(action.payload);
      })
      .addCase(listRecipesAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createRecipeAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRecipeAction.fulfilled, (state, action) => {
        state.isLoading = false;
        // Newest first; the response has no details, so reuse the meal's.
        state.listRecipes.unshift({
          ...action.payload,
          details: action.meta.arg.details,
        });
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
        // The update response has no details: merge so they're kept.
        state.listRecipes = state.listRecipes.map((recipe) =>
          recipe.id === action.payload.id
            ? { ...recipe, ...action.payload }
            : recipe,
        );
        if (state.selectedRecipe?.id === action.payload.id) {
          state.selectedRecipe = { ...state.selectedRecipe, ...action.payload };
        }
      })
      .addCase(updateRecipeAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteRecipeAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRecipeAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRecipes = state.listRecipes.filter(
          (recipe) => recipe.id !== action.payload,
        );
        if (state.selectedRecipe?.id === action.payload) {
          state.selectedRecipe = null;
        }
      })
      .addCase(deleteRecipeAction.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { removeRecipe } = recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
