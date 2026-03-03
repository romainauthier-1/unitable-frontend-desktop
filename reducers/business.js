import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [], // Attendu {businessCommercialName: String, ownerName: String}
};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    addBusiness: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { addBusiness } = businessSlice.actions;
export default businessSlice.reducer;
