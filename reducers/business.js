import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    addBusiness: (state, action) => {
  
      // Vérifier que le business n'existe pas déjà avant de l'ajouter
      const businessExists = state.value.find(
        (business) => business.id === action.payload.id,
      );
      if (!businessExists) {
        state.value.push(action.payload);
      }
    },
    addReferenceTeams: (state, action) => {
      // console.log("PAYLOAD RECU DANS LE REDUCER BUSINESS: ", action.payload);
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
    resetBusiness: (state) => {
      state.value = [];
    },
  },
});

export const { addBusiness, addReferenceTeams, resetBusiness } =
  businessSlice.actions;
export default businessSlice.reducer;
