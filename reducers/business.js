import { createSlice } from "@reduxjs/toolkit";
import { id } from "date-fns/locale";

const initialState = {
  value: [],
};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    addBusiness: (state, action) => {
      state.value.push(action.payload);
    },
    addReferenceTeams: (state, action) => {
      console.log("PAYLOAD RECU DANS LE REDUCER BUSINESS: ", action.payload);
      const { businessId, teams } = action.payload;
      const foundBusiness = state.value.find(
        (business) => business.id === businessId,
      );
      if (foundBusiness) {
        foundBusiness.referenceTeams = teams;
      } else {
        console.error(
          "Impossible d'ajouter les équipes de référence dans le store",
        );
      }
    },
  },
});

export const { addBusiness, addReferenceTeams } = businessSlice.actions;
export default businessSlice.reducer;
