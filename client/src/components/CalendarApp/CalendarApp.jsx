import React, { useState } from "react";
import { useDeleteCalendar } from "../../hooks/useDeleteCalendar";
import { useUpdateCalendar } from "../../hooks/useUpdateCalendar";
import styles from "./CalendarApp.module.css";
import { Header } from "../Header";
import { Calendars } from "../Calendars";
import { Events } from "../Events";
import { useFetchEvents } from "../../hooks/useFetchEvents";
import { useAddEvent } from "../../hooks/useAddEvent";
import { useDeleteEvent } from "../../hooks/useDeleteEvent";
import { useUpdateEvent } from "../../hooks/useUpdateEvent";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { setCurrentEvent } from "../../reducers/eventSlice";
import { useFetchCalendars } from "../../hooks/useFetchCalendars";
import { useAddCalendar } from "../../hooks/useAddCalendar";
import { useDeleteRecurrenceEvents } from "../../hooks/useDeleteRecurrenceEvents";
import { useDeleteCalendarWithEvents } from "../../hooks/useDeleteCalendarWithEvents";
import { useUpdateRecurrenceEvents } from "../../hooks/useUpdateRecurrenceEvents";

export const CalendarApp = ({ user }) => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state) => state.event.currentEvent);
  const currentDate = currentEvent.date
    ? new Date(currentEvent.date)
    : new Date();

  // console.log("Calendar currentDate", currentDate);
  // console.log(" Calendar currentEvent.date", currentEvent.date);

  const postQueryEvents = useFetchEvents();
  const addEvent = useAddEvent();
  const deleteEvent = useDeleteEvent();
  const deleteCalendarWithEvents = useDeleteCalendarWithEvents();
  const updateEvent = useUpdateEvent();
  const deleteRecurrenceEvents = useDeleteRecurrenceEvents();
  const updateRecurrenceEvents = useUpdateRecurrenceEvents();

  const postQueryCalendars = useFetchCalendars();
  const addCalendar = useAddCalendar();
  const deleteCalendar = useDeleteCalendar();
  const updateCalendar = useUpdateCalendar();

  const [viewMode, setViewMode] = useState("Week");
  const [isDatepickerVisible, setIsDatepickerVisible] = useState(false);

  const [periodicityArray, setPeriodicityArray] = useState(() => {
    const validDate = currentDate instanceof Date && !isNaN(currentDate);
    return [
      "Does not repeat",
      "Daily",
      validDate ? `Weekly on ${format(currentDate, "EEEE")}` : "Weekly on",
      "Monthly",
      validDate
        ? `Annually on ${format(currentDate, "MMMM d")}`
        : "Annually on",
    ];
  });

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString();

    const newPeriodicityArray = [
      "Does not repeat",
      "Daily",
      `Weekly on ${format(date, "EEEE")}`,
      "Monthly",
      `Annually on ${format(date, "MMMM d")}`,
    ];
    // console.log("newPeriodicityArray", newPeriodicityArray);

    let updatedPeriodicity = currentEvent.periodicity;
    if (updatedPeriodicity.startsWith("Weekly on")) {
      updatedPeriodicity = newPeriodicityArray[2];
    } else if (updatedPeriodicity.startsWith("Annually on")) {
      updatedPeriodicity = newPeriodicityArray[4];
    } else {
      updatedPeriodicity = currentEvent.periodicity;
    }
    // console.log("updatedPeriodicity", updatedPeriodicity);

    dispatch(
      setCurrentEvent({
        ...currentEvent,
        date: formattedDate,
        periodicity: updatedPeriodicity,
      })
    );
    setPeriodicityArray(newPeriodicityArray);
    setIsDatepickerVisible(false);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    dispatch(setCurrentEvent({ date: newDate.toISOString() }));
    handleDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    dispatch(setCurrentEvent({ date: newDate.toISOString() }));
    handleDateChange(newDate);
  };

  if (postQueryCalendars.isLoading || postQueryEvents.isLoading) {
    return <div>Loading...</div>;
  }

  if (postQueryCalendars.isError || postQueryEvents.isError) {
    return (
      <pre>
        {JSON.stringify(postQueryCalendars.error || postQueryEvents.error)}
      </pre>
    );
  }

  return (
    <div className={styles.calendarContainer}>
      <Header
        user={user}
        currentEvent={currentEvent}
        currentDate={currentDate}
        postQueryEvents={postQueryEvents.data}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDateChange={handleDateChange}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
      />
      <main>
        <div className={styles.events}>
          <Events
            postQueryCalendars={postQueryCalendars.data}
            postQueryEvents={postQueryEvents.data}
            addEvent={addEvent}
            deleteEvent={deleteEvent}
            deleteRecurrenceEvents={deleteRecurrenceEvents}
            updateEvent={updateEvent}
            updateRecurrenceEvents={updateRecurrenceEvents}
            currentEvent={currentEvent}
            currentDate={currentDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            periodicityArray={periodicityArray}
            onDateChange={handleDateChange}
            isDatepickerVisible={isDatepickerVisible}
            setIsDatepickerVisible={setIsDatepickerVisible}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
          />
        </div>
        <div className={styles.calendars}>
          <Calendars
            postQueryCalendars={postQueryCalendars.data}
            postQueryEvents={postQueryEvents.data}
            addCalendar={addCalendar}
            deleteCalendar={deleteCalendar}
            deleteCalendarWithEvents={deleteCalendarWithEvents}
            updateCalendar={updateCalendar}
          />
        </div>
      </main>
    </div>
  );
};
