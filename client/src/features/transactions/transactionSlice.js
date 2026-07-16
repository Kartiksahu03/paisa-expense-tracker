import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { transactionApi } from "./transactionApi.js";

const initialState = {
  items: [],
  summary: null,
  status: "idle",
  error: null,
};

export const fetchTransactions = createAsyncThunk("txn/list", async (month) =>
  transactionApi.list(month)
);
export const fetchSummary = createAsyncThunk("txn/summary", async (month) =>
  transactionApi.summary(month)
);
export const addTransaction = createAsyncThunk("txn/add", async (data) =>
  transactionApi.add(data)
);
export const deleteTransaction = createAsyncThunk("txn/delete", async (id) =>
  transactionApi.remove(id)
);

const txnSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (s) => { s.status = "loading"; })
      .addCase(fetchTransactions.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; })
      .addCase(fetchSummary.fulfilled, (s, a) => { s.summary = a.payload; })
      .addCase(addTransaction.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(deleteTransaction.fulfilled, (s, a) => {
        s.items = s.items.filter((t) => t._id !== a.payload.id);
      });
  },
});

export default txnSlice.reducer;
