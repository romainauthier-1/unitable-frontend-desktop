import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.value = Array.isArray(action.payload) ? action.payload : [];
    },
    addTeam: (state, action) => {
      // Vérifier si le team n'existe pas déjà dans le store
      const teamExists = state.value.find(
        (team) => team.id === action.payload.id,
      );
      if (!teamExists) {
        state.value.push(action.payload);
      }
    },
    updateTeam: (state, action) => {
      const { id, ...updates } = action.payload;
      const teamToUpdate = state.value.find((team) => team.id === id);
      if (teamToUpdate) {
        Object.assign(teamToUpdate, updates);
      }
    },
    deleteTeam: (state, action) => {
      state.value = state.value.filter(
        (team) => team.id !== action.payload,
      );
    },
  },
});

export const { setTeams, addTeam, updateTeam, deleteTeam } = teamsSlice.actions;
export default teamsSlice.reducer;
