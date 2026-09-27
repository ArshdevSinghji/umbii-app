import { createSlice } from "@reduxjs/toolkit";
import { createFoodLogsAction } from "./create-food-logs/create-food-logs.action";
import { FoodLogState, GenerateFoodLogsDetails } from "./food-logs.types";
import { getFoodLogAction } from "./get-food-log/get-food-log.action";
import { listFoodLogsAction } from "./list-food-logs/list-food-logs.action";
import { generateFoodLogsAction } from "./generate-food-logs/generate-food-logs.action";

const initialState: FoodLogState = {
  isLoading: false,
  listFoodLogs: [],
  generatedFoodLogsDetails: {} as GenerateFoodLogsDetails,
  selectedFoodLog: null,
  isFoodLogLoading: false,
};

const foodLogsSlice = createSlice({
  name: "foodLogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listFoodLogsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listFoodLogsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listFoodLogs = action.payload;
      })
      .addCase(listFoodLogsAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createFoodLogsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFoodLogsAction.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createFoodLogsAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(generateFoodLogsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateFoodLogsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generatedFoodLogsDetails = action.payload;
      })
      .addCase(generateFoodLogsAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getFoodLogAction.pending, (state) => {
        state.isFoodLogLoading = true;
      })
      .addCase(getFoodLogAction.fulfilled, (state, action) => {
        state.isFoodLogLoading = false;
        state.selectedFoodLog = action.payload;
      })
      .addCase(getFoodLogAction.rejected, (state) => {
        state.isFoodLogLoading = false;
      });
  },
});

export const {} = foodLogsSlice.actions;
export const foodLogsReducer = foodLogsSlice.reducer;
