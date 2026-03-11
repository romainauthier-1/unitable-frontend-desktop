import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, email: null, name: null, id: null },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.name = action.payload.name;
      state.value.id = action.payload.id;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.name = null;
      state.value.id = null
    },
    addName: (state, action) => {
      state.value.name = action.payload;
    },
  },
});

export const { login, logout, addName } = userSlice.actions;
export default userSlice.reducer;
