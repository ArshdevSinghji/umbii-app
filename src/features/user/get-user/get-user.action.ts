import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserActionTypes } from "../user.types";
import { getUserService } from "./get-user.service";
import { GetUserRequest } from "./get-user.types";

export const getUserAction = createAsyncThunk(
  UserActionTypes.GET_USER,
  async (request: GetUserRequest, thunkAPI) => {
    try {
      const response = await getUserService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
