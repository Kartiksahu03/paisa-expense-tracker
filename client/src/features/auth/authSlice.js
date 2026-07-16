import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "./authApi.js";

const stored = localStorage.getItem("paisa_user");

const initialState = {
  user: stored ? JSON.parse(stored) : null,
  status: "idle",
  error: null,
};

export const registerUser = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    return await authApi.register(data);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    return await authApi.login(data);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("paisa_user");
    },
  },
  extraReducers: (builder) => {
    const success = (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      localStorage.setItem("paisa_user", JSON.stringify(action.payload));
    };
    builder
      .addCase(registerUser.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(registerUser.fulfilled, success)
      .addCase(registerUser.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })
      .addCase(loginUser.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(loginUser.fulfilled, success)
      .addCase(loginUser.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
