import { createAsyncThunk } from "@reduxjs/toolkit";
import { WeightJournalActionTypes } from "../weight-journals.types";
import { createWeightJournalService } from "./create-weight-journal.service";
import { CreateWeightJournalRequest } from "./create-weight-journal.types";

export const createWeightJournalAction = createAsyncThunk(
  WeightJournalActionTypes.CREATE_WEIGHT_JOURNAL,
  async (request: CreateWeightJournalRequest, thunkAPI) => {
    try {
      const response = await createWeightJournalService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
