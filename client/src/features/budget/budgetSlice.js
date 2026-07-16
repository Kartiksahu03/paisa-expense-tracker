import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { budgetApi } from "./budgetApi.js";

const initialState = { data: null, status: "idle" };

export const fetchBudget = createAsyncThunk("budget/get", async (month) =>
  budgetApi.get(month)
);
export const setBudget = createAsyncThunk("budget/set", async (data) =>
  budgetApi.set(data)
);

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.fulfilled, (s, a) => { s.data = a.payload; })
      .addCase(setBudget.fulfilled, (s) => { s.status = "updated"; });
  },
});

export default budgetSlice.reducer;
