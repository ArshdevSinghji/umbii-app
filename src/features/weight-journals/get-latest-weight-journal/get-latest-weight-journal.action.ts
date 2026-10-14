import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { listWeightJournalsService } from "../list-weight-journals/list-weight-journals.service";
import { WeightJournalActionTypes } from "../weight-journals.types";
import { GetLatestWeightJournalRequest } from "./get-latest-weight-journal.types";

// The list endpoint without a date range returns the user's all-time latest
// entry as `[latest]`, or `[]` if they've never logged a weight.
export const getLatestWeightJournalAction = createAsyncThunk(
  WeightJournalActionTypes.GET_LATEST_WEIGHT_JOURNAL,
  async ({ userId }: GetLatestWeightJournalRequest, thunkAPI) => {
    try {
      const response = await listWeightJournalsService({ userId });
      return response.data[0] ?? null;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
