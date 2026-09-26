import { createAsyncThunk } from "@reduxjs/toolkit";
import { WeightJournalActionTypes } from "../weight-journals.types";
import { updateWeightJournalService } from "./update-weight-journal.service";
import { UpdateWeightJournalRequest } from "./update-weight-journal.types";

export const updateWeightJournalAction = createAsyncThunk(
  WeightJournalActionTypes.UPDATE_WEIGHT_JOURNAL,
  async (request: UpdateWeightJournalRequest, thunkAPI) => {
    try {
      const response = await updateWeightJournalService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
