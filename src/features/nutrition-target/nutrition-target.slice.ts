import { createSlice } from "@reduxjs/toolkit";
import { createNutritionTargetAction } from "./create-nutrition-target/create-nutrition-target.action";
import { getNutritionTargetReportAction } from "./get-nutrition-target-report/get-nutrition-target-report.action";
import { getNutritionTargetAction } from "./get-nutrition-target/get-nutrition-target.action";
import { getPeriodNutritionTargetAction } from "./get-period-nutrition-target/get-period-nutrition-target.action";
import { getCalendarNutritionTargetReportAction } from "./get-calendar-nutrition-target-report/get-calendar-nutrition-target-report.action";
import { NutritionTargetState } from "./nutrition-target.types";

// Identifies a request by everything it asks for (user + params).
const toQueryKey = (arg: unknown) => JSON.stringify(arg);

const initialState: NutritionTargetState = {
  isLoading: false,
  isReportLoading: false,
  targetQuery: null,
  reportQuery: null,
  periodNutritionTarget: null,
  isPeriodTargetLoading: false,
  periodTargetQuery: null,
  calendarReport: null,
  isCalendarReportLoading: false,
  calendarReportQuery: null,
  nutritionTarget: null,
  report: null,
};

const nutritionTargetSlice = createSlice({
  name: "nutritionTarget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNutritionTargetAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNutritionTargetAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nutritionTarget = action.payload;
      })
      .addCase(createNutritionTargetAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getNutritionTargetAction.pending, (state, action) => {
        // Loading only for a different query; the same one reloads quietly.
        const query = toQueryKey(action.meta.arg);
        if (query !== state.targetQuery) state.isLoading = true;
        state.targetQuery = query;
      })
      .addCase(getNutritionTargetAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nutritionTarget = action.payload;
      })
      .addCase(getNutritionTargetAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getNutritionTargetReportAction.pending, (state, action) => {
        const query = toQueryKey(action.meta.arg);
        if (query !== state.reportQuery) state.isReportLoading = true;
        state.reportQuery = query;
      })
      .addCase(getNutritionTargetReportAction.fulfilled, (state, action) => {
        state.isReportLoading = false;
        state.report = action.payload;
      })
      .addCase(getNutritionTargetReportAction.rejected, (state) => {
        state.isReportLoading = false;
      })
      .addCase(getPeriodNutritionTargetAction.pending, (state, action) => {
        const query = toQueryKey(action.meta.arg);
        if (query !== state.periodTargetQuery)
          state.isPeriodTargetLoading = true;
        state.periodTargetQuery = query;
      })
      .addCase(getPeriodNutritionTargetAction.fulfilled, (state, action) => {
        state.isPeriodTargetLoading = false;
        state.periodNutritionTarget = action.payload;
      })
      .addCase(getPeriodNutritionTargetAction.rejected, (state) => {
        state.isPeriodTargetLoading = false;
      })
      .addCase(
        getCalendarNutritionTargetReportAction.pending,
        (state, action) => {
          const query = toQueryKey(action.meta.arg);
          if (query !== state.calendarReportQuery) {
            state.isCalendarReportLoading = true;
          }
          state.calendarReportQuery = query;
        },
      )
      .addCase(
        getCalendarNutritionTargetReportAction.fulfilled,
        (state, action) => {
          state.isCalendarReportLoading = false;
          state.calendarReport = action.payload;
        },
      )
      .addCase(getCalendarNutritionTargetReportAction.rejected, (state) => {
        state.isCalendarReportLoading = false;
      });
  },
});

export const {} = nutritionTargetSlice.actions;
export const nutritionTargetReducer = nutritionTargetSlice.reducer;
