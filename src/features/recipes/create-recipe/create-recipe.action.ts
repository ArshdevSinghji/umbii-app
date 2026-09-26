import { createAsyncThunk } from "@reduxjs/toolkit";
import { RecipeActionTypes } from "../recipes.types";
import { createRecipeService } from "./create-recipe.service";
import { CreateRecipeRequest } from "./create-recipe.types";

export const createRecipeAction = createAsyncThunk(
  RecipeActionTypes.CREATE_RECIPE,
  async (request: CreateRecipeRequest, thunkAPI) => {
    try {
      const response = await createRecipeService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
