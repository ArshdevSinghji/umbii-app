import { createAsyncThunk } from "@reduxjs/toolkit";
import { RecipeActionTypes } from "../recipes.types";
import { deleteRecipeService } from "./delete-recipe.service";
import { DeleteRecipeRequest } from "./delete-recipe.types";

export const deleteRecipeAction = createAsyncThunk(
  RecipeActionTypes.DELETE_RECIPE,
  async (request: DeleteRecipeRequest, thunkAPI) => {
    try {
      await deleteRecipeService(request);
      return request.recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
