import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FoodLogActionTypes } from "../food-logs.types";
import { deleteFoodLogService } from "./delete-food-log.service";
import { DeleteFoodLogRequest } from "./delete-food-log.types";

// Resolves the deleted id, so the slice can drop it from every list.
export const deleteFoodLogAction = createAsyncThunk(
  FoodLogActionTypes.DELETE_FOOD_LOG,
  async (request: DeleteFoodLogRequest, thunkAPI) => {
    try {
      await deleteFoodLogService(request);
      return request.foodLogId;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
