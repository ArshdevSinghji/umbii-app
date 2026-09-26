import { createAsyncThunk } from "@reduxjs/toolkit";
import { WeightJournalActionTypes } from "../weight-journals.types";
import { getWeightJournalService } from "./get-weight-journal.service";
import { GetWeightJournalRequest } from "./get-weight-journal.types";

export const getWeightJournalAction = createAsyncThunk(
  WeightJournalActionTypes.GET_WEIGHT_JOURNAL,
  async (request: GetWeightJournalRequest, thunkAPI) => {
    try {
      const response = await getWeightJournalService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
