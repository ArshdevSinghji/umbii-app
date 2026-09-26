import { createAsyncThunk } from "@reduxjs/toolkit";
import { WeightJournalActionTypes } from "../weight-journals.types";
import { deleteWeightJournalService } from "./delete-weight-journal.service";
import { DeleteWeightJournalRequest } from "./delete-weight-journal.types";

export const deleteWeightJournalAction = createAsyncThunk(
  WeightJournalActionTypes.DELETE_WEIGHT_JOURNAL,
  async (request: DeleteWeightJournalRequest, thunkAPI) => {
    try {
      await deleteWeightJournalService(request);
      return request.weightJournalId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
