import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserActionTypes } from "../user.types";
import { listFoodLogsService } from "./list-food-logs.service";
import { ListFoodLogsRequest } from "./list-food-logs.types";

export const listFoodLogsAction = createAsyncThunk(
  UserActionTypes.LIST_FOOD_LOGS,
  async (request: ListFoodLogsRequest, thunkAPI) => {
    try {
      const response = await listFoodLogsService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
