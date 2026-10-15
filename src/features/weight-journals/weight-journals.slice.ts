import { createSlice } from "@reduxjs/toolkit";
import { createWeightJournalAction } from "./create-weight-journal/create-weight-journal.action";
import { deleteWeightJournalAction } from "./delete-weight-journal/delete-weight-journal.action";
import { getLatestWeightJournalAction } from "./get-latest-weight-journal/get-latest-weight-journal.action";
import { getWeightJournalAction } from "./get-weight-journal/get-weight-journal.action";
import { listWeightJournalsAction } from "./list-weight-journals/list-weight-journals.action";
import { updateWeightJournalAction } from "./update-weight-journal/update-weight-journal.action";
import { IWeightJournal, WeightJournalState } from "./weight-journals.types";

const initialState: WeightJournalState = {
  latestWeightJournal: null,
  latestStatus: "idle",
  chartWeightJournals: [],
  chartRange: null,
  chartStatus: "idle",
  isSaving: false,
  selectedWeightJournal: null,
  isSelectedLoading: false,
};

const isInChartRange = (state: WeightJournalState, entry: IWeightJournal) => {
  if (!state.chartRange) return false;
  const day = entry.createdAt.slice(0, 10);
  return day >= state.chartRange.startDate && day <= state.chartRange.endDate;
};

const weightJournalsSlice = createSlice({
  name: "weightJournals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Latest entry. "loading" only until the first answer: refetches keep
      // showing the current data instead of flashing the skeleton.
      .addCase(getLatestWeightJournalAction.pending, (state) => {
        if (state.latestStatus !== "ready") state.latestStatus = "loading";
      })
      .addCase(getLatestWeightJournalAction.fulfilled, (state, action) => {
        state.latestStatus = "ready";
        state.latestWeightJournal = action.payload;
      })
      .addCase(getLatestWeightJournalAction.rejected, (state) => {
        if (state.latestStatus !== "ready") state.latestStatus = "error";
      })
      // Chart entries for a date range.
      .addCase(listWeightJournalsAction.pending, (state, action) => {
        const { params } = action.meta.arg;
        state.chartRange = {
          startDate: params?.["dateRange.startDate"] ?? "",
          endDate: params?.["dateRange.endDate"] ?? "",
        };
        state.chartStatus = "loading";
      })
      .addCase(listWeightJournalsAction.fulfilled, (state, action) => {
        state.chartStatus = "ready";
        state.chartWeightJournals = action.payload;
      })
      .addCase(listWeightJournalsAction.rejected, (state) => {
        state.chartStatus = "error";
      })
      .addCase(createWeightJournalAction.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(createWeightJournalAction.fulfilled, (state, action) => {
        state.isSaving = false;
        const entry = action.payload;
        // Today's entry is the newest of all time.
        state.latestWeightJournal = entry;
        // POST is an upsert: a later save today returns today's existing
        // entry (same id), so replace it rather than adding a second point.
        const index = state.chartWeightJournals.findIndex(
          (journal) => journal.id === entry.id,
        );
        if (index !== -1) {
          state.chartWeightJournals[index] = entry;
        } else if (isInChartRange(state, entry)) {
          // Chart list is newest first; only add it if it's in range.
          state.chartWeightJournals.unshift(entry);
        }
      })
      .addCase(createWeightJournalAction.rejected, (state) => {
        state.isSaving = false;
      })
      .addCase(getWeightJournalAction.pending, (state) => {
        state.isSelectedLoading = true;
      })
      .addCase(getWeightJournalAction.fulfilled, (state, action) => {
        state.isSelectedLoading = false;
        state.selectedWeightJournal = action.payload;
      })
      .addCase(getWeightJournalAction.rejected, (state) => {
        state.isSelectedLoading = false;
      })
      .addCase(updateWeightJournalAction.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateWeightJournalAction.fulfilled, (state, action) => {
        state.isSaving = false;
        state.selectedWeightJournal = action.payload;
        state.chartWeightJournals = state.chartWeightJournals.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry,
        );
        if (state.latestWeightJournal?.id === action.payload.id) {
          state.latestWeightJournal = action.payload;
        }
      })
      .addCase(updateWeightJournalAction.rejected, (state) => {
        state.isSaving = false;
      })
      .addCase(deleteWeightJournalAction.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(deleteWeightJournalAction.fulfilled, (state, action) => {
        state.isSaving = false;
        state.chartWeightJournals = state.chartWeightJournals.filter(
          (entry) => entry.id !== action.payload,
        );
        if (state.selectedWeightJournal?.id === action.payload) {
          state.selectedWeightJournal = null;
        }
        // If the latest was deleted, the hook refetches it (the next one may
        // be outside the chart's range, so only the server knows).
      })
      .addCase(deleteWeightJournalAction.rejected, (state) => {
        state.isSaving = false;
      });
  },
});

export const weightJournalsReducer = weightJournalsSlice.reducer;
