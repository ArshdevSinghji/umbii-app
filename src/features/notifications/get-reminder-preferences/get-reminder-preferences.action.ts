import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationActionTypes } from "../notifications.types";
import { getReminderPreferencesService } from "./get-reminder-preferences.service";
import { GetReminderPreferencesRequest } from "./get-reminder-preferences.types";

export const getReminderPreferencesAction = createAsyncThunk(
  NotificationActionTypes.GET_REMINDER_PREFERENCES,
  async (request: GetReminderPreferencesRequest, thunkAPI) => {
    try {
      const response = await getReminderPreferencesService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
