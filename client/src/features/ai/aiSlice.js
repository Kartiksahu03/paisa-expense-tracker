import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aiApi } from "./aiApi.js";

const initialState = { insight: "", adding: false, error: null };

export const aiAdd = createAsyncThunk("ai/add", async (text, thunkAPI) => {
  try {
    return await aiApi.add(text);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || "Could not add");
  }
});

export const fetchInsight = createAsyncThunk("ai/insight", async () => aiApi.insight());

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(aiAdd.pending, (s) => { s.adding = true; s.error = null; })
      .addCase(aiAdd.fulfilled, (s) => { s.adding = false; })
      .addCase(aiAdd.rejected, (s, a) => { s.adding = false; s.error = a.payload; })
      .addCase(fetchInsight.fulfilled, (s, a) => { s.insight = a.payload.insight; });
  },
});

export default aiSlice.reducer;
