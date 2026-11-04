import { getErrorStatus, toRequestError } from "@/lib/http-client";
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
      // 404 "Nutrition target not set.": no target yet (e.g. before one is
      // generated), a normal state rather than a failure.
      if (getErrorStatus(error) === 404) return null;
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
