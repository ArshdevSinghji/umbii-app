import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationActionTypes } from "../notifications.types";
import { patchNotificationPreferencesService } from "./patch-notification-preferences.service";
import { PatchNotificationPreferencesRequest } from "./patch-notification-preferences.types";

export const patchNotificationPreferencesAction = createAsyncThunk(
  NotificationActionTypes.PATCH_NOTIFICATION_PREFERENCES,
  async (request: PatchNotificationPreferencesRequest, thunkAPI) => {
    try {
      const response = await patchNotificationPreferencesService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
