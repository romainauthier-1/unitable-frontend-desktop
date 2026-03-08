import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    addBusiness: (state, action) => {
      console.log("PAYLOAD RECU DANS LE REDUCER BUSINESS: ", action.payload);
      state.value.push(action.payload);
    },
  },
});

export const { addBusiness } = businessSlice.actions;
export default businessSlice.reducer;
