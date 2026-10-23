import { getErrorStatus, toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationActionTypes } from "../notifications.types";
import { unregisterPushDeviceService } from "./unregister-push-device.service";
import { UnregisterPushDeviceRequest } from "./unregister-push-device.types";

export const unregisterPushDeviceAction = createAsyncThunk(
  NotificationActionTypes.UNREGISTER_PUSH_DEVICE,
  async (request: UnregisterPushDeviceRequest, thunkAPI) => {
    try {
      await unregisterPushDeviceService(request);
    } catch (error) {
      // 404: already gone (e.g. replaced or the session ended), which is
      // what we wanted.
      if (getErrorStatus(error) === 404) return;
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
