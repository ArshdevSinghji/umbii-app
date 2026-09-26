import { createAsyncThunk } from "@reduxjs/toolkit";
import { RecipeActionTypes } from "../recipes.types";
import { getRecipeService } from "./get-recipe.service";
import { GetRecipeRequest } from "./get-recipe.types";

export const getRecipeAction = createAsyncThunk(
  RecipeActionTypes.GET_RECIPE,
  async (request: GetRecipeRequest, thunkAPI) => {
    try {
      const response = await getRecipeService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
