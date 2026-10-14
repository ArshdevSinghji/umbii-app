import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FoodLogActionTypes } from "../food-logs.types";
import { listFoodLogsService } from "../list-food-logs/list-food-logs.service";
import { ListFoodLogsRequest } from "../list-food-logs/list-food-logs.types";

// Same endpoint as listFoodLogs, but for Breakdown's selected period. Kept in
// its own `periodFoodLogs` state so it never overwrites Home's day.
export const listPeriodFoodLogsAction = createAsyncThunk(
  FoodLogActionTypes.LIST_PERIOD_FOOD_LOGS,
  async (request: ListFoodLogsRequest, thunkAPI) => {
    try {
      const response = await listFoodLogsService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
