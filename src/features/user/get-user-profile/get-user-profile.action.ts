import { getErrorStatus, toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserActionTypes } from "../user.types";
import { getUserProfileService } from "./get-user-profile.service";
import { GetUserProfileRequest } from "./get-user-profile.types";

export const getUserProfileAction = createAsyncThunk(
  UserActionTypes.GET_USER_PROFILE,
  async (request: GetUserProfileRequest, thunkAPI) => {
    try {
      const response = await getUserProfileService(request);
      return response.data;
    } catch (error) {
      // 404: not onboarded yet, a normal state rather than a failure.
      if (getErrorStatus(error) === 404) return null;
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
