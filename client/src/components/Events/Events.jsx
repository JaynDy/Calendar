import styles from "./Events.module.css";
import { useState } from "react";
import { FormEvents } from "../FormEvents";
import { Button } from "@@/Button/Button";
import { Modal } from "@@/Modal";
import { useDispatch } from "react-redux";
import { clearCurrentEvent, setCurrentEvent } from "../../reducers/eventSlice";
import { TableView } from "../TableView";
import { v4 as uuidv4 } from "uuid";
import { convertTo24HourFormat } from "./eventUtil";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";

export const Events = ({
  postQueryCalendars,
  postQueryEvents,
  addEvent,
  deleteEvent,
  deleteRecurrenceEvents,
  updateEvent,
  updateRecurrenceEvents,
  currentEvent,
  currentDate,
  viewMode,
  setViewMode,
  periodicityArray,
  onDateChange,
  isDatepickerVisible,
  setIsDatepickerVisible,
  handlePrevMonth,
  handleNextMonth,
}) => {
  const dispatch = useDispatch();

  // console.log("Events currentEvent", currentEvent);
  // console.log("Events postQueryEvents", postQueryEvents);
  // console.log("Events currentDate", currentDate);

  const [isFormEventsVisible, setIsFormEventsVisible] = useState(false);
  const [isEventInfoVisible, setIsEventInfoVisible] = useState(false);
  const [isFormEventsDeleteVisible, setIsFormEventsDeleteVisible] =
    useState(false);
  const [error, setError] = useState({});
  const [isEditingSinglEvent, setIsEditingSinglEvent] = useState(false);
  const validationErrors = {};
  const reccurenceCurrentEventsLength = postQueryEvents.filter(
    (event) => event.recurrenceId === currentEvent.recurrenceId,
  ).length;
  // console.log(reccurenceCurrentEventsLength);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentEvent.title.trim()) {
      validationErrors.title = "Title is required";
    }

    if (
      currentEvent.time &&
      convertTo24HourFormat(currentEvent.time.startTime) >
        convertTo24HourFormat(currentEvent.time.endTime)
    ) {
      validationErrors.time = validationErrors.time || {};
      validationErrors.time.endTime = "Select the correct time";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const eventToSubmit = {
        ...currentEvent,
        recurrenceId:
          currentEvent.periodicity !== "Does not repeat" ? uuidv4() : "",
      };

      if (isEditingSinglEvent && currentEvent.id) {
        await updateEvent.mutateAsync({
          id: currentEvent.id,
          updatedText: eventToSubmit.title,
          updatedDate: eventToSubmit.date,
          updatedTime: eventToSubmit.time,
          updatedIsAllDay: eventToSubmit.isAllDay,
          updatedPeriodicity: eventToSubmit.periodicity,
          updatedCalendar: eventToSubmit.calendar,
          updatedDescription: eventToSubmit.description,
          updatedRecurrenceId: eventToSubmit.recurrenceId,
          updatedCompleted: eventToSubmit.completed,
        });

        // await updateEvent.mutateAsync({
        //   id: currentEvent.id,
        //   title: eventToSubmit.title,
        //   date: eventToSubmit.date,
        //   time: eventToSubmit.time,
        //   isAllDay: eventToSubmit.isAllDay,
        //   periodicity: eventToSubmit.periodicity,
        //   calendar: eventToSubmit.calendar,
        //   description: eventToSubmit.description,
        //   recurrenceId: eventToSubmit.recurrenceId,
        //   completed: eventToSubmit.completed,
        // });
      } else if (
        currentEvent.id &&
        currentEvent.periodicity !== "Does not repeat" &&
        reccurenceCurrentEventsLength > 1
      ) {
        console.log("Current event recurrenceId:", currentEvent.recurrenceId);
        console.log("Current event periodicity:", currentEvent.periodicity);

        const recurringEvents = postQueryEvents.filter(
          (event) => event.recurrenceId === currentEvent.recurrenceId,
        );
        console.log("recurringEvents", recurringEvents);

        const currentIndex = recurringEvents.findIndex(
          (event) => event.id === currentEvent.id,
        );
        console.log("currentIndex", currentIndex);

        const updatedEvents = recurringEvents.map((recurringEvent, index) => {
          let newDate = new Date(eventToSubmit.date);

          if (eventToSubmit.periodicity === "Daily") {
            newDate = addDays(newDate, index);
          } else if (eventToSubmit.periodicity.startsWith("Weekly")) {
            newDate = addWeeks(newDate, index);
          } else if (eventToSubmit.periodicity.startsWith("Monthly")) {
            newDate = addMonths(newDate, index);
          } else if (eventToSubmit.periodicity.startsWith("Annually on")) {
            newDate = addYears(newDate, index);
          }
          console.log(
            `Updated event ${index} (ID: ${recurringEvents[index].id}) newDate:`,
            newDate,
          );

          return {
            recurrenceId: recurringEvent.recurrenceId,
            updatedText: eventToSubmit.title,
            updatedDate: newDate.toISOString(),
            updatedTime: eventToSubmit.time,
            updatedIsAllDay: eventToSubmit.isAllDay,
            updatedPeriodicity: eventToSubmit.periodicity,
            updatedCalendar: eventToSubmit.calendar,
            updatedDescription: eventToSubmit.description,
            updatedRecurrenceId: eventToSubmit.recurrenceId,
            updatedCompleted: eventToSubmit.completed,
            id: recurringEvent.id,
          };

          // return {
          //   id: recurringEvent.recurrenceId,
          //   title: eventToSubmit.title,
          //   date: newDate.toISOString(),
          //   time: eventToSubmit.time,
          //   isAllDay: eventToSubmit.isAllDay,
          //   periodicity: eventToSubmit.periodicity,
          //   calendar: eventToSubmit.calendar,
          //   description: eventToSubmit.description,
          //   recurrenceId: eventToSubmit.recurrenceId,
          //   completed: eventToSubmit.completed,
          //   id: recurringEvent.id,
          // };
        });
        await updateRecurrenceEvents.mutateAsync(updatedEvents);
      } else {
        console.log("Adding new event eventToSubmit:", eventToSubmit);

        if (eventToSubmit.periodicity !== "Does not repeat") {
          createRecurringEvents(eventToSubmit);
        }
        await addEvent.mutateAsync(eventToSubmit);
      }
    } catch (error) {
      console.error("Error formatting date", error);
    } finally {
      dispatch(clearCurrentEvent());
      setIsFormEventsVisible(false);
    }
  };

  const createRecurringEvents = async (event) => {
    const eventsToCreate = [];
    const startDate = new Date(event.date);

    if (event.periodicity === "Daily") {
      for (let i = 1; i <= 30; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        eventsToCreate.push({
          ...event,
          date: newDate.toISOString(),
        });
      }
    } else if (event.periodicity.startsWith("Weekly")) {
      for (let i = 1; i <= 12; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i * 7);
        eventsToCreate.push({
          ...event,
          date: newDate.toISOString(),
        });
      }
    } else if (event.periodicity.startsWith("Monthly")) {
      for (let i = 1; i <= 12; i++) {
        const newDate = new Date(startDate);
        newDate.setMonth(startDate.getMonth() + i);
        eventsToCreate.push({
          ...event,
          date: newDate.toISOString(),
        });
      }
    } else if (event.periodicity.startsWith("Annually on")) {
      for (let i = 1; i <= 12; i++) {
        const newDate = new Date(startDate);
        newDate.setFullYear(startDate.getFullYear() + i);
        eventsToCreate.push({
          ...event,
          date: newDate.toISOString(),
        });
      }
    }

    for (const recurringEvent of eventsToCreate) {
      await addEvent.mutateAsync(recurringEvent);
    }
  };

  const handleDeleteRecurrenceEvent = (recurrenceId) => {
    const reccurenceEventsToDelete = postQueryEvents.filter(
      (event) => event.recurrenceId === recurrenceId,
    );
    console.log("reccurenceEvents to delete:", reccurenceEventsToDelete);
    if (reccurenceEventsToDelete.length > 0) {
      deleteRecurrenceEvents.mutate(recurrenceId);
    }
    dispatch(clearCurrentEvent());
    setIsFormEventsDeleteVisible(false);
  };

  const handleDeleteEvent = (id) => {
    deleteEvent.mutate(id);
    dispatch(clearCurrentEvent());
    setIsFormEventsDeleteVisible(false);
  };

  const handleCreateClick = () => {
    dispatch(clearCurrentEvent());
    setIsFormEventsVisible(true);
  };

  const handleEditClick = (event) => {
    console.log("handleEditClick Start event", event);
    dispatch(setCurrentEvent(event));
    setIsFormEventsVisible(true);
    setIsEventInfoVisible(false);
    setIsFormEventsDeleteVisible(false);
    console.log("handleEditClick Editing event:", event);
  };

  const handleDeleteClick = (event) => {
    setIsEventInfoVisible(false);
    setIsFormEventsDeleteVisible(true);
    dispatch(setCurrentEvent(event));
  };

  const handleClose = (e) => {
    e.preventDefault();
    dispatch(clearCurrentEvent());
    setIsFormEventsVisible(false);
    setIsEventInfoVisible(false);
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setIsFormEventsDeleteVisible(false);
  };

  return (
    <div className={styles.todoAppContainer}>
      <Button
        primary
        label="Create"
        icon="Plus"
        className={styles.createButton}
        onClick={handleCreateClick}
      />
      <FormEvents
        postQueryCalendars={postQueryCalendars}
        postQueryEvents={postQueryEvents}
        updateEvent={updateEvent}
        title={currentEvent.id ? "Edit event" : "Create event"}
        currentEvent={currentEvent}
        currentDate={currentDate}
        isFormVisible={isFormEventsVisible}
        handleSubmit={handleSubmit}
        onClose={handleClose}
        periodicityArray={periodicityArray}
        onDateChange={onDateChange}
        isDatepickerVisible={isDatepickerVisible}
        setIsDatepickerVisible={setIsDatepickerVisible}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        error={error}
        setError={setError}
        validationErrors={validationErrors}
        reccurenceCurrentEventsLength={reccurenceCurrentEventsLength}
        setIsEditingSinglEvent={setIsEditingSinglEvent}
      />
      {postQueryEvents && (
        <TableView
          viewMode={viewMode}
          setViewMode={setViewMode}
          currentEvent={currentEvent}
          currentDate={currentDate}
          postQueryEvents={postQueryEvents}
          setIsEventInfoVisible={setIsEventInfoVisible}
        />
      )}
      {currentEvent.id && isEventInfoVisible && (
        <FormEvents
          postQueryCalendars={postQueryCalendars}
          postQueryEvents={postQueryEvents}
          updateEvent={updateEvent}
          title="Event information"
          currentEvent={currentEvent}
          currentDate={currentDate}
          isEventInfoVisible={isEventInfoVisible}
          handleSubmit={handleSubmit}
          onClose={handleClose}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
          isReadOnly={true}
          periodicityArray={periodicityArray}
          onDateChange={onDateChange}
          isDatepickerVisible={isDatepickerVisible}
          setIsDatepickerVisible={setIsDatepickerVisible}
          error={error}
          setError={setError}
          validationErrors={validationErrors}
          reccurenceCurrentEventsLength={reccurenceCurrentEventsLength}
          setIsEditingSinglEvent={setIsEditingSinglEvent}
        />
      )}

      {currentEvent.id && isFormEventsDeleteVisible && (
        <Modal
          onClose={handleDeleteClose}
          title="Delete event  "
          icon="Close"
          children={`Are you sure you want to delete Event ${currentEvent.title}? You'll no longer have access to it.`}
          isFormDeleteVisible={isFormEventsDeleteVisible}
          currentEvent={currentEvent}
          postQueryEvents={postQueryEvents}
          onDeleteEvent={() => handleDeleteEvent(currentEvent.id)}
          onDeleteRecurrenceEvent={() =>
            handleDeleteRecurrenceEvent(currentEvent.recurrenceId)
          }
          reccurenceCurrentEventsLength={reccurenceCurrentEventsLength}
        />
      )}
    </div>
  );
};
