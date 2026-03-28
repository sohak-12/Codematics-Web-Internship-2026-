import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./accountSlice";

export const appStore = configureStore({
  reducer: {
    account: accountReducer,
  },
});
