import { createAsyncThunk } from "@reduxjs/toolkit";
import { NutritionTargetActionTypes } from "../nutrition-target.types";
import { createNutritionTargetService } from "./create-nutrition-target.service";
import { NutritionTargetRequest } from "./create-nutrition-target.types";

export const creareNutritionTargetAction = createAsyncThunk(
  NutritionTargetActionTypes.CREATE_NUTRITION_TARGET,
  async (request: NutritionTargetRequest, thunkAPI) => {
    try {
        const response = await createNutritionTargetService(request);
        return response.data;
    } catch(error) {
        return thunkAPI.rejectWithValue(error);
    }
  },
);
