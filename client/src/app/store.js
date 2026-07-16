import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import transactionReducer from "../features/transactions/transactionSlice.js";
import budgetReducer from "../features/budget/budgetSlice.js";
import aiReducer from "../features/ai/aiSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budget: budgetReducer,
    ai: aiReducer,
  },
});
