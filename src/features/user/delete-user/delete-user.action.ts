import { toRequestError } from "@/lib/http-client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserActionTypes } from "../user.types";
import { deleteUserService } from "./delete-user.service";
import { DeleteUserRequest } from "./delete-user.types";

export const deleteUserAction = createAsyncThunk(
  UserActionTypes.DELETE_USER,
  async (request: DeleteUserRequest, thunkAPI) => {
    try {
      await deleteUserService(request);
      return request.userId;
    } catch (error) {
      return thunkAPI.rejectWithValue(toRequestError(error));
    }
  },
);
