import { createAsyncThunk } from "@reduxjs/toolkit";
import { NutritionTargetActionTypes } from "../nutrition-target.types";
import { getNutritionTargetReportService } from "./get-nutrition-target-report.service";
import { GetNutritionTargetReportRequest } from "./get-nutrition-target-report.types";

export const getNutritionTargetReportAction = createAsyncThunk(
  NutritionTargetActionTypes.GET_NUTRITION_TARGET_REPORT,
  async (request: GetNutritionTargetReportRequest, thunkAPI) => {
    try {
      const response = await getNutritionTargetReportService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
