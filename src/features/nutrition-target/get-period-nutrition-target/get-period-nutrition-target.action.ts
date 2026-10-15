import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getNutritionTargetService } from "../get-nutrition-target/get-nutrition-target.service";
import { GetNutritionTargetRequest } from "../get-nutrition-target/get-nutrition-target.types";
import { NutritionTargetActionTypes } from "../nutrition-target.types";

// Same endpoint as getNutritionTarget, but lands in its own
// `periodNutritionTarget` state: Breakdown's day / week / month / year totals
// must never replace the daily target Home is showing (tabs stay mounted).
export const getPeriodNutritionTargetAction = createAsyncThunk(
  NutritionTargetActionTypes.GET_PERIOD_NUTRITION_TARGET,
  async (request: GetNutritionTargetRequest, thunkAPI) => {
    try {
      const response = await getNutritionTargetService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
