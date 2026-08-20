import { createAsyncThunk } from "@reduxjs/toolkit";
import { createFoodLogsService } from "./create-food-logs.service";
import { CreateFoodLogsRequest } from "./create-food-logs.types";
import { FoodLogActionTypes } from "../food-logs.types";

export const createFoodLogsAction = createAsyncThunk(
  FoodLogActionTypes.CREATE_FOOD_LOGS,
  async (request: CreateFoodLogsRequest, thunkAPI) => {
    try {
      const response = await createFoodLogsService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
