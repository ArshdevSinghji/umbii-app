import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationActionTypes } from "../notifications.types";
import { patchReminderPreferencesService } from "./patch-reminder-preferences.service";
import { PatchReminderPreferencesRequest } from "./patch-reminder-preferences.types";

export const patchReminderPreferencesAction = createAsyncThunk(
  NotificationActionTypes.PATCH_REMINDER_PREFERENCES,
  async (request: PatchReminderPreferencesRequest, thunkAPI) => {
    try {
      const response = await patchReminderPreferencesService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
