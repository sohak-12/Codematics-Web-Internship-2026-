import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    user: null,
    role: "client",
    loading: true,
  },
  reducers: {
    setAccountDetails: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    clearAccount: (state) => {
      state.user = null;
      state.role = "client";
      state.loading = false;
    },
  },
});

export const { setAccountDetails, setUserRole, clearAccount } = accountSlice.actions;
export default accountSlice.reducer;
