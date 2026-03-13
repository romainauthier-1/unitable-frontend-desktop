import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    employees: [],
  },
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployeesInStore: (state, action) => {
      state.value.employees = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
    addEmployeeToStore: (state, action) => {
      // Nouvel employé
      state.value.employees.push(action.payload);
    },
    // Supprimer
    removeEmployeeFromStore: (state, action) => {
      state.value.employees = state.value.employees.filter(
        (employee) => employee._id !== action.payload,
      );
    },
    // Mettre à jour
    updateEmployeeInStore: (state, action) => {
      const index = state.value.employees.findIndex(
        (employee) => employee._id === action.payload._id,
      );
      if (index !== -1) {
        state.value.employees[index] = action.payload;
      }
    },
    clearEmployee: (state) => {
      state.value.employees = [];
    },
  },
});

export const {
  setEmployeesInStore,
  addEmployeeToStore,
  removeEmployeeFromStore,
  updateEmployeeInStore,
  clearEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
