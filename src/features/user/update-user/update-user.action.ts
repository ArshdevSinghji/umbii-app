import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserActionTypes } from "../user.types";
import { updateUserService } from "./update-user.service";
import { UpdateUserRequest } from "./update-user.types";

export const updateUserAction = createAsyncThunk(
  UserActionTypes.UPDATE_USER,
  async (request: UpdateUserRequest, thunkAPI) => {
    try {
      const response = await updateUserService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
