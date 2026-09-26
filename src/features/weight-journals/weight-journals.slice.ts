import { createSlice } from "@reduxjs/toolkit";
import { createWeightJournalAction } from "./create-weight-journal/create-weight-journal.action";
import { deleteWeightJournalAction } from "./delete-weight-journal/delete-weight-journal.action";
import { getWeightJournalAction } from "./get-weight-journal/get-weight-journal.action";
import { listWeightJournalsAction } from "./list-weight-journals/list-weight-journals.action";
import { updateWeightJournalAction } from "./update-weight-journal/update-weight-journal.action";
import { WeightJournalState } from "./weight-journals.types";

const initialState: WeightJournalState = {
  isLoading: false,
  listWeightJournals: [],
  selectedWeightJournal: null,
};

const weightJournalsSlice = createSlice({
  name: "weightJournals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listWeightJournalsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listWeightJournalsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listWeightJournals = action.payload;
      })
      .addCase(listWeightJournalsAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createWeightJournalAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWeightJournalAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listWeightJournals.push(action.payload);
      })
      .addCase(createWeightJournalAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getWeightJournalAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWeightJournalAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedWeightJournal = action.payload;
      })
      .addCase(getWeightJournalAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateWeightJournalAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWeightJournalAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedWeightJournal = action.payload;
        state.listWeightJournals = state.listWeightJournals.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry,
        );
      })
      .addCase(updateWeightJournalAction.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteWeightJournalAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteWeightJournalAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listWeightJournals = state.listWeightJournals.filter(
          (entry) => entry.id !== action.payload,
        );
        if (state.selectedWeightJournal?.id === action.payload) {
          state.selectedWeightJournal = null;
        }
      })
      .addCase(deleteWeightJournalAction.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {} = weightJournalsSlice.actions;
export const weightJournalsReducer = weightJournalsSlice.reducer;
