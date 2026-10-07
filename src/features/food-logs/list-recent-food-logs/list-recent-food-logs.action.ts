import { createAsyncThunk } from "@reduxjs/toolkit";
import { FoodLogActionTypes } from "../food-logs.types";
import { listFoodLogsService } from "../list-food-logs/list-food-logs.service";
import { ListFoodLogsRequest } from "../list-food-logs/list-food-logs.types";

// Same endpoint as listFoodLogs, but lands in its own `recentFoodLogs` state
// so it never overwrites the date-specific list Home and Breakdown use.
export const listRecentFoodLogsAction = createAsyncThunk(
  FoodLogActionTypes.LIST_RECENT_FOOD_LOGS,
  async (request: ListFoodLogsRequest, thunkAPI) => {
    try {
      const response = await listFoodLogsService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
