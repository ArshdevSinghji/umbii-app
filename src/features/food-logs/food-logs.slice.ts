import { removeRecipe } from "@/features/recipes/recipes.slice";
import { createRecipeAction } from "@/features/recipes/create-recipe/create-recipe.action";
import { deleteRecipeAction } from "@/features/recipes/delete-recipe/delete-recipe.action";
import { createSlice } from "@reduxjs/toolkit";
import { createFoodLogsAction } from "./create-food-logs/create-food-logs.action";
import {
  FoodLogState,
  GenerateFoodLogsDetails,
  IFoodLog,
} from "./food-logs.types";
import { getFoodLogAction } from "./get-food-log/get-food-log.action";
import { listFoodLogsAction } from "./list-food-logs/list-food-logs.action";
import { generateFoodLogsAction } from "./generate-food-logs/generate-food-logs.action";
import { listPeriodFoodLogsAction } from "./list-period-food-logs/list-period-food-logs.action";
import { listRecentFoodLogsAction } from "./list-recent-food-logs/list-recent-food-logs.action";

const logLists = (state: FoodLogState) => [
  state.listFoodLogs,
  state.periodFoodLogs,
  state.recentFoodLogs,
];

// Swap a log (by id) in every cached list and the selected one.
const replaceLog = (
  state: FoodLogState,
  id: number,
  update: (log: IFoodLog) => IFoodLog,
) => {
  for (const list of logLists(state)) {
    const index = list.findIndex((log) => log.id === id);
    if (index !== -1) list[index] = update(list[index]);
  }
  if (state.selectedFoodLog?.id === id) {
    state.selectedFoodLog = update(state.selectedFoodLog);
  }
};

const initialState: FoodLogState = {
  isLoading: false,
  listFoodLogs: [],
  listFoodLogsDate: null,
  periodRange: null,
  isListLoading: false,
  periodFoodLogs: [],
  isPeriodFoodLogsLoading: false,
  generatedFoodLogsDetails: {} as GenerateFoodLogsDetails,
  selectedFoodLog: null,
  isFoodLogLoading: false,
  recentFoodLogs: [],
};

const foodLogsSlice = createSlice({
  name: "foodLogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listFoodLogsAction.pending, (state, action) => {
        const date = action.meta.arg.params?.date ?? null;
        // Skeleton only for a different day; refreshing the same day (e.g.
        // when Home regains focus) updates quietly in place.
        if (date !== state.listFoodLogsDate) state.isListLoading = true;
        state.listFoodLogsDate = date;
      })
      .addCase(listFoodLogsAction.fulfilled, (state, action) => {
        state.isListLoading = false;
        state.listFoodLogs = action.payload;
      })
      .addCase(listFoodLogsAction.rejected, (state) => {
        state.isListLoading = false;
      })
      .addCase(listPeriodFoodLogsAction.pending, (state, action) => {
        state.isPeriodFoodLogsLoading = true;
        const params = action.meta.arg.params;
        state.periodRange = {
          startDate: params?.["dateRange.startDate"] ?? "",
          endDate: params?.["dateRange.endDate"] ?? "",
        };
      })
      .addCase(listPeriodFoodLogsAction.fulfilled, (state, action) => {
        state.isPeriodFoodLogsLoading = false;
        state.periodFoodLogs = action.payload;
      })
      .addCase(listPeriodFoodLogsAction.rejected, (state) => {
        state.isPeriodFoodLogsLoading = false;
      })
      .addCase(createFoodLogsAction.pending, (state) => {
        state.isLoading = true;
      })
      // The response is the saved log: add it to every list it belongs in
      // (all newest first) instead of refetching them.
      .addCase(createFoodLogsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        const log = action.payload;
        const day = log.createdAt.slice(0, 10);

        state.recentFoodLogs.unshift(log);
        if (state.listFoodLogsDate === day) {
          state.listFoodLogs.unshift(log);
        }
        if (
          state.periodRange &&
          day >= state.periodRange.startDate &&
          day <= state.periodRange.endDate
        ) {
          state.periodFoodLogs.unshift(log);
        }
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
        // A fresh copy (e.g. after a 409) replaces any cached one.
        replaceLog(state, action.payload.id, () => action.payload);
      })
      // Saving / deleting a recipe changes its log's recipeId; mirror it
      // everywhere that log is shown so "Save as recipe" stays accurate.
      // The response no longer names the source log: take it from the request.
      .addCase(createRecipeAction.fulfilled, (state, action) => {
        const recipeId = action.payload.id;
        replaceLog(state, action.meta.arg.foodLogId, (log) => ({
          ...log,
          recipeId,
        }));
      })
      .addCase(getFoodLogAction.rejected, (state) => {
        state.isFoodLogLoading = false;
      })
      // No loading flag: the page shows its skeleton only on first load,
      // and refreshes after logging a meal shouldn't flash it.
      .addCase(listRecentFoodLogsAction.fulfilled, (state, action) => {
        state.recentFoodLogs = action.payload;
      })
      .addMatcher(
        (action) =>
          deleteRecipeAction.fulfilled.match(action) ||
          removeRecipe.match(action),
        (state, action: { payload: number }) => {
          const recipeId = action.payload;
          for (const list of logLists(state)) {
            for (const log of list)
              if (log.recipeId === recipeId) log.recipeId = null;
          }
          if (state.selectedFoodLog?.recipeId === recipeId) {
            state.selectedFoodLog.recipeId = null;
          }
        },
      );
  },
});

export const {} = foodLogsSlice.actions;
export const foodLogsReducer = foodLogsSlice.reducer;
