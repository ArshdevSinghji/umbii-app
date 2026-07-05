import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserActionTypes } from "../user.types";
import { signInService } from "./sign-in.service";
import { SignInRequest } from "./sign-in.types";

export const signInAction = createAsyncThunk(
  UserActionTypes.SIGN_IN,
  async (request: SignInRequest, thunkAPI) => {
    try {
      const response = await signInService(request);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
