import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  title: "",
  date: "",
  time: {
    startTime: "",
    endTime: "",
  },
  isAllDay: "",
  periodicity: "",
  calendar: {
    id: "",
    name: "",
    color: "",
    isDefault: "",
    isChecked: "",
  },
  description: "",
  completed: "",
  recurrenceId: "",
};

export const eventSlice = createSlice({
  name: "event",
  initialState: {
    currentEvent: initialState,
  },

  reducers: {
    setCurrentEvent: (state, action) => {
      // console.log("Action payload:", action.payload);
      state.currentEvent = {
        ...state.currentEvent,
        ...action.payload,
      };
      // console.log("Updated currentEvent state:", state.currentEvent);
    },

    clearCurrentEvent: (state) => {
      // state.currentEvent = initialState;
      const currentDate = state.currentEvent.date;
      state.currentEvent = {
        ...initialState,
        date: currentDate,
      };
    },
  },
});
export const { setCurrentEvent, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
