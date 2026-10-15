import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getNutritionTargetReportService } from "../get-nutrition-target-report/get-nutrition-target-report.service";
import { GetNutritionTargetReportRequest } from "../get-nutrition-target-report/get-nutrition-target-report.types";
import { NutritionTargetActionTypes } from "../nutrition-target.types";

// Same endpoint as getNutritionTargetReport, but lands in its own
// `calendarReport` state: Breakdown's calendar month must never replace the
// week Home's circles are showing (tabs stay mounted).
export const getCalendarNutritionTargetReportAction = createAsyncThunk(
  NutritionTargetActionTypes.GET_CALENDAR_NUTRITION_TARGET_REPORT,
  async (request: GetNutritionTargetReportRequest, thunkAPI) => {
    try {
      const response = await getNutritionTargetReportService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
