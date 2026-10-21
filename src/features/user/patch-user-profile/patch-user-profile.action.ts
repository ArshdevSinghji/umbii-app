import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserActionTypes } from "../user.types";
import { patchUserProfileService } from "./patch-user-profile.service";
import { PatchUserProfileRequest } from "./patch-user-profile.types";

export const patchUserProfileAction = createAsyncThunk(
  UserActionTypes.PATCH_USER_PROFILE,
  async (request: PatchUserProfileRequest, thunkAPI) => {
    try {
      const response = await patchUserProfileService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
