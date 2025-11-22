import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addUser: (state, action) => {
      state.user = action.payload;
    },
    deleteUser: (state) => {
      state.user = null;
    },
  },
});

export const { setLoading, addUser, deleteUser } = authSlice.actions;
export default authSlice.reducer;