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
    },
    {
      id: 2,
      name: "Diner",
      startTime: 1080,
      endTime: 1290,
      dayOfWeek: ["lundi"],
      restaurant: null,
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
