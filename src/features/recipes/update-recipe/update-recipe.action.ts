import { createAsyncThunk } from "@reduxjs/toolkit";
import { RecipeActionTypes } from "../recipes.types";
import { updateRecipeService } from "./update-recipe.service";
import { UpdateRecipeRequest } from "./update-recipe.types";

export const updateRecipeAction = createAsyncThunk(
  RecipeActionTypes.UPDATE_RECIPE,
  async (request: UpdateRecipeRequest, thunkAPI) => {
    try {
      const response = await updateRecipeService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
