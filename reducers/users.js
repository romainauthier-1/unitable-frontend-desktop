import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, email: null, name: null },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
    },
    addName: (state, action) => {
      state.value.name = action.payload;
    },
  },
});

export const { login, logout, addName } = userSlice.actions;
export default userSlice.reducer;
