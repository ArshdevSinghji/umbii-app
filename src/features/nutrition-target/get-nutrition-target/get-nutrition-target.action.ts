import { createAsyncThunk } from "@reduxjs/toolkit";
import { NutritionTargetActionTypes } from "../nutrition-target.types";
import { getNutritionTargetService } from "./get-nutrition-target.service";
import { GetNutritionTargetRequest } from "./get-nutrition-target.types";

export const getNutritionTargetAction = createAsyncThunk(
  NutritionTargetActionTypes.GET_NUTRITION_TARGET,
  async (request: GetNutritionTargetRequest, thunkAPI) => {
    try {
      const response = await getNutritionTargetService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
