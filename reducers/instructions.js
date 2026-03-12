import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    "/services": true,
    "/templatePlanning": true,
    "/createTeams": true,
  },
};

export const instructionsSlice = createSlice({
  name: "instructions",
  initialState,
  reducers: {
    toggleInstructions: (state, action) => {
      const route = action.payload;
      if (state.value[route] !== undefined) {
        state.value[route] = !state.value[route];
      }
    },
    clearInstructions: (state) => { 
      state.value.employees = [];
      }
  },
});

export const { toggleInstructions, clearInstructions } = instructionsSlice.actions;
export default instructionsSlice.reducer;
