import { createSlice } from "@reduxjs/toolkit";

// Services par défaut
const initialState = {
  value: [
    {
      id: 1,
      name: "Dejeuner",
      startTime: 720,
      endTime: 900,
      dayOfWeek: ["lundi"],
      restaurant: null,
      equipes: [
        {
          teamName: "Cuisine",
          roles: [
            { name: "Chef", need: 0 },
            { name: "Second", need: 0 },
            { name: "Chef de partie", need: 0 },
            { name: "Plongeur", need: 0 },
          ],
        },
        {
          teamName: "Salle",
          roles: [
            { name: "Responsable", need: 0 },
            { name: "Serveur", need: 0 },
            { name: "Runner", need: 0 },
            { name: "Barman", need: 0 },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Diner",
      startTime: 1080,
      endTime: 1290,
      dayOfWeek: ["lundi"],
      restaurant: null,
      equipes: [
        {
          teamName: "Cuisine",
          roles: [
            { name: "Chef", need: 0 },
            { name: "Second", need: 0 },
            { name: "Chef de partie", need: 0 },
            { name: "Plongeur", need: 0 },
          ],
        },
        {
          teamName: "Salle",
          roles: [
            { name: "Responsable", need: 0 },
            { name: "Serveur", need: 0 },
            { name: "Runner", need: 0 },
            { name: "Barman", need: 0 },
          ],
        },
      ],
    },
  ],
};

export const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    updateIdRestaurant: (state, action) => {
      const updatedServices = state.value.map((service) => {
        return { ...service, restaurant: action.payload };
      });
      state.value = updatedServices;
    },
    updateService: (state, action) => {
      const { id, name, startTime, endTime, dayOfWeek, restaurant } =
        action.payload;
      const serviceToUpdate = state.value.find((service) => service.id === id);
      name && (serviceToUpdate.name = name);
      startTime && (serviceToUpdate.startTime = startTime);
      endTime && (serviceToUpdate.endTime = endTime);
      dayOfWeek && (serviceToUpdate.dayOfWeek = dayOfWeek);
      restaurant && (serviceToUpdate.restaurant = restaurant);
    },
    updateTeamName: (state, action) => {
      const { id, teamName } = action.payload;
      const serviceToUpdate = state.value.find((service) => service.id === id);
      if (serviceToUpdate) {
        serviceToUpdate.equipes = serviceToUpdate.equipes.map((team) => {
          if (team.teamName === action.payload.oldTeamName) {
            return { ...team, teamName };
          }
          return team;
        });
      }
    },
    updateRoleName: (state, action) => {
      const { id, teamName, roleName, oldRoleName } = action.payload;
      const serviceToUpdate = state.value.find((service) => service.id === id);
      if (serviceToUpdate) {
        // On cherche l'équipe concernée
        serviceToUpdate.equipes = serviceToUpdate.equipes.map((team) => {
          if (team.teamName === teamName) {
            // On cherche le rôle concerné dans l'équipe
            team.roles = team.roles.map((role) => {
              // On renomme le rôle si c'est celui ciblé
              if (role.name === oldRoleName) {
                // On return le rôle mis à jour
                return { ...role, name: roleName };
              }
              // On return le rôle s'il n'est pas modifié
              return role;
            });
          }
          // On return l'équipe si elle n'est pas modifiée
          return team;
        });
      }
    },
    updateRoleNeed: (state, action) => {
      const { id, teamName, roleName, need } = action.payload;
      const serviceToUpdate = state.value.find((service) => service.id === id);
      if (serviceToUpdate) {
        // On cherche l'équipe concernée
        serviceToUpdate.equipes = serviceToUpdate.equipes.map((team) => {
          if (team.teamName === teamName) {
            // On cherche le rôle concerné dans l'équipe
            team.roles = team.roles.map((role) => {
              // On met à jour le besoin du rôle ciblé
              if (role.name === roleName) {
                // On return le rôle mis à jour
                return { ...role, need };
              }
              // On return le rôle s'il n'est pas modifié
              return role;
            });
          }
          // On return l'équipe si elle n'est pas modifiée
          return team;
        });
      }
    },
    addService: (state, action) => {
      state.value.push(action.payload);
    },
    deleteService: (state, action) => {
      state.value = state.value.filter(
        (service) => service.id !== action.payload,
      );
    },
  },
});

export const { addService, updateIdRestaurant, updateService, deleteService } =
  serviceSlice.actions;
export default serviceSlice.reducer;
