import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};
// FORMAT ATTENDU POUR UN SERVICE
// {
//   id: 1,
//   name: "Déjeuner",
//   startTime: 720,
//   endTime: 980,
//   dayOfWeek: ["lundi", "mardi"...],
//   restaurant: id MongoDB,
//   teams: [
//     {
//       teamName: Cuisine,
//       roles: [{ name: Chef de partie, need: 0 }],
//     },
//     {
//       teamName: Salle,
//       roles: [{ name: Serveur, need: 0 }],
//     },
//   ],
// },

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
      const serviceToUpdate = state.value.find(
        (service) => service._id === id || service.id === id,
      );
      name && (serviceToUpdate.name = name);
      startTime && (serviceToUpdate.startTime = startTime);
      endTime && (serviceToUpdate.endTime = endTime);
      dayOfWeek && (serviceToUpdate.dayOfWeek = dayOfWeek);
      restaurant && (serviceToUpdate.restaurant = restaurant);
    },
    addTeamToService: (state, action) => {
      const { id, teamName, roles } = action.payload;
      console.log("Payload reçu dans addTeamToService:", action.payload);
      const serviceToUpdate = state.value.find(
        (service) => (service.id || service._id) === id,
      );
   
      if (!serviceToUpdate) {
        console.log("Service introuvable pour l'id:", id);
        return;
      }
      //teamName prend Team Name et le Nom du service pour éviter les doublons de nom d'équipe entre les services
      const uniqueTeamName = `${teamName} - ${serviceToUpdate.name} - {${serviceToUpdate.dayOfWeek}}`;
      const alreadyExists = serviceToUpdate.teams?.some(
        (team) => team.teamName === uniqueTeamName,
      );
      if (!alreadyExists) {
        serviceToUpdate.teams.push({ teamName: uniqueTeamName, roles });
      }
    },
    updateTeamName: (state, action) => {
      const { id, teamName } = action.payload;
      const serviceToUpdate = state.value.find(
        (service) => service._id === id || service.id === id,
      );
      if (serviceToUpdate) {
        serviceToUpdate.teams = serviceToUpdate.teams.map((team) => {
          if (team.teamName === action.payload.oldTeamName) {
            return { ...team, teamName };
          }
          return team;
        });
      }
    },
    updateRoleName: (state, action) => {
      const { id, teamName, roleName, oldRoleName } = action.payload;
      const serviceToUpdate = state.value.find(
        (service) => service._id === id || service.id === id,
      );
      if (serviceToUpdate) {
        // On cherche l'équipe concernée
        serviceToUpdate.teams = serviceToUpdate.teams.map((team) => {
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
      const serviceToUpdate = state.value.find(
        (service) => service._id === id || service.id === id,
      );
      if (serviceToUpdate) {
        // On cherche l'équipe concernée
        serviceToUpdate.teams = serviceToUpdate.teams.map((team) => {
          if (team.teamName === teamName) {
            // On cherche le rôle concerné dans l'équipe
            team.roles = team.roles.map((role) => {
              // On met à jour le besoin du rôle ciblé
              if (role.name === roleName) {
                // On return le rôle mis à jour
                return { ...role, need: Number(need) || 0 };
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
    deleteTeamFromService: (state, action) => {
      const { id, teamName } = action.payload;
      const serviceToUpdate = state.value.find(
        (service) => service._id === id || service.id === id,
      );
      if (serviceToUpdate) {
        serviceToUpdate.teams = serviceToUpdate.teams.filter(
          (team) => team.teamName !== teamName,
        );
        console.log("service", id);
        console.log("teamName", teamName);
      }
    },
    addService: (state, action) => {
      // Vérifier si le service n'existe pas déjà dans le store
      const serviceExists = state.value.find(
        (service) => service.id === action.payload.id,
      );
      if (!serviceExists) {
        state.value.push(action.payload);
      }
    },
    setServices: (state, action) => {
      state.value = action.payload;
      // console.log("Services dans le store après setServices:", state.value);
    },
    deleteService: (state, action) => {
      state.value = state.value.filter(
        //  (service) => service.id !== action.payloadctio,
        (service) => (service._id || service.id) !== action.payload,
      );
    },
    clearService:(state) =>{
      state.value = [];
    }
  },
});

export const {
  addService,
  setServices,
  updateIdRestaurant,
  updateService,
  deleteService,
  updateTeamName,
  updateRoleName,
  updateRoleNeed,
  addTeamToService,
  deleteTeamFromService,
  clearService,
} = serviceSlice.actions;
export default serviceSlice.reducer;
