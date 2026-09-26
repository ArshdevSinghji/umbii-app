import { createAsyncThunk } from "@reduxjs/toolkit";
import { WeightJournalActionTypes } from "../weight-journals.types";
import { listWeightJournalsService } from "./list-weight-journals.service";
import { ListWeightJournalsRequest } from "./list-weight-journals.types";

export const listWeightJournalsAction = createAsyncThunk(
  WeightJournalActionTypes.LIST_WEIGHT_JOURNALS,
  async (request: ListWeightJournalsRequest, thunkAPI) => {
    try {
      const response = await listWeightJournalsService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
