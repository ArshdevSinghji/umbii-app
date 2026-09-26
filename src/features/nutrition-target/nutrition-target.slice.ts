import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const nutritionTargetSlice = createSlice({
    name: "nutritionTarget",
    initialState,
    reducers: {},
    extraReducers: (builder) => {}
});

export const {} = nutritionTargetSlice.actions;
export const nutritionTargetReducer = nutritionTargetSlice.reducer;