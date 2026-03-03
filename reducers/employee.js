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
		addEmployeeToStore: (state, action) => {
			// Nouvel employé
			state.value.employees.push(action.payload);
		},
		// Supprimer
		removeEmployeeFromStore: (state, action) => {
			state.value.employees = state.value.employees.filter(
				(employee) => employee.id !== action.payload,
			);
		},
		// Mettre à jour
		updateEmployeeInStore: (state, action) => {
			const index = state.value.employees.findIndex(
				(employee) => employee.id === action.payload.id,
			);
			if (index !== -1) {
				state.value.employees[index] = action.payload;
			}
		},
	},
});

export const {
	addEmployeeToStore,
	removeEmployeeFromStore,
	updateEmployeeInStore,
} = employeeSlice.actions;

export default employeeSlice.reducer;
