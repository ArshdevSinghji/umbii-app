import { createAsyncThunk } from "@reduxjs/toolkit";
import { FoodLogActionTypes } from "../food-logs.types";
import { GenerateFoodLogsRequest } from "./generate-food-logs.types";
import { generateFoodLogsService } from "./generate-food-logs.service";

export const generateFoodLogsAction = createAsyncThunk(
  FoodLogActionTypes.GENERATE_FOOD_LOGS,
  async (request: GenerateFoodLogsRequest, thunkAPI) => {
    try {
      const response = await generateFoodLogsService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
