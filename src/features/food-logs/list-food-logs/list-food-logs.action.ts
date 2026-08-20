import { createAsyncThunk } from "@reduxjs/toolkit";
import { listFoodLogsService } from "./list-food-logs.service";
import { ListFoodLogsRequest } from "./list-food-logs.types";
import { FoodLogActionTypes } from "../food-logs.types";

export const listFoodLogsAction = createAsyncThunk(
  FoodLogActionTypes.LIST_FOOD_LOGS,
  async (request: ListFoodLogsRequest, thunkAPI) => {
    try {
      const response = await listFoodLogsService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
