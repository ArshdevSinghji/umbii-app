import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationActionTypes } from "../notifications.types";
import { getNotificationPreferencesService } from "./get-notification-preferences.service";
import { GetNotificationPreferencesRequest } from "./get-notification-preferences.types";

export const getNotificationPreferencesAction = createAsyncThunk(
  NotificationActionTypes.GET_NOTIFICATION_PREFERENCES,
  async (request: GetNotificationPreferencesRequest, thunkAPI) => {
    try {
      const response = await getNotificationPreferencesService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
