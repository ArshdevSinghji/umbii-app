import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationActionTypes } from "../notifications.types";
import { registerPushDeviceService } from "./register-push-device.service";
import { RegisterPushDeviceRequest } from "./register-push-device.types";

export const registerPushDeviceAction = createAsyncThunk(
  NotificationActionTypes.REGISTER_PUSH_DEVICE,
  async (request: RegisterPushDeviceRequest, thunkAPI) => {
    try {
      const response = await registerPushDeviceService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
