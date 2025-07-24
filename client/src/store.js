import { configureStore } from "@reduxjs/toolkit";
import { calendarSlice } from "./reducers/calendarSlice";
import { eventSlice } from "./reducers/eventSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarSlice.reducer,
    event: eventSlice.reducer,
  },
});
