import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NutritionTargetActionTypes } from "../nutrition-target.types";
import { generateNutritionTargetService } from "./generate-nutrition-target.service";
import { GenerateNutritionTargetRequest } from "./generate-nutrition-target.types";

export const generateNutritionTargetAction = createAsyncThunk(
  NutritionTargetActionTypes.GENERATE_NUTRITION_TARGET,
  async (request: GenerateNutritionTargetRequest, thunkAPI) => {
    try {
      const response = await generateNutritionTargetService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
