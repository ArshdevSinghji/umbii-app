import { createAsyncThunk } from "@reduxjs/toolkit";
import { FoodLogActionTypes } from "../food-logs.types";
import { getFoodLogService } from "./get-food-log.service";
import { GetFoodLogRequest } from "./get-food-log.types";

export const getFoodLogAction = createAsyncThunk(
  FoodLogActionTypes.GET_FOOD_LOG,
  async (request: GetFoodLogRequest, thunkAPI) => {
    try {
      const response = await getFoodLogService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
