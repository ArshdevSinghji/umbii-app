import { createSlice } from "@reduxjs/toolkit";
import { creareNutritionTargetAction } from "./create-nutrition-target/create-nutrition-target.action";
import { getNutritionTargetReportAction } from "./get-nutrition-target-report/get-nutrition-target-report.action";
import { getNutritionTargetAction } from "./get-nutrition-target/get-nutrition-target.action";
import { NutritionTargetState } from "./nutrition-target.types";

const initialState: NutritionTargetState = {
  isLoading: false,
  nutritionTarget: null,
  report: null,
};

const nutritionTargetSlice = createSlice({
  name: "nutritionTarget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(creareNutritionTargetAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(creareNutritionTargetAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nutritionTarget = action.payload;
      })
      .addCase(creareNutritionTargetAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getNutritionTargetAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNutritionTargetAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nutritionTarget = action.payload;
      })
      .addCase(getNutritionTargetAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getNutritionTargetReportAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNutritionTargetReportAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.report = action.payload;
      })
      .addCase(getNutritionTargetReportAction.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {} = nutritionTargetSlice.actions;
export const nutritionTargetReducer = nutritionTargetSlice.reducer;