import { createAsyncThunk } from "@reduxjs/toolkit";
import { RecipeActionTypes } from "../recipes.types";
import { listRecipesService } from "./list-recipes.service";
import { ListRecipesRequest } from "./list-recipes.types";

export const listRecipesAction = createAsyncThunk(
  RecipeActionTypes.LIST_RECIPES,
  async (request: ListRecipesRequest, thunkAPI) => {
    try {
      const response = await listRecipesService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
