import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  name: "",
  color: "",
  isDefault: "",
  isChecked: "",
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    currentCalendar: initialState,
  },

  reducers: {
    setCurrentCalendar: (state, action) => {
      // console.log("Action payload:", action.payload);
      state.currentCalendar = {
        ...state.currentCalendar,
        ...action.payload,
      };
      // console.log("Updated currentCalendar state:", state.currentCalendar);
    },

    clearCurrentCalendar: (state) => {
      state.currentCalendar = initialState;
    },
  },
});
export const { setCurrentCalendar, clearCurrentCalendar } =
  calendarSlice.actions;
export default calendarSlice.reducer;
