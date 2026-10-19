import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserActionTypes } from "../user.types";
import { saveUserOnboardingService } from "./save-user-onboarding.service";
import { SaveUserOnboardingRequest } from "./save-user-onboarding.types";

export const saveUserOnboardingAction = createAsyncThunk(
  UserActionTypes.SAVE_USER_ONBOARDING,
  async (request: SaveUserOnboardingRequest, thunkAPI) => {
    try {
      const response = await saveUserOnboardingService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
