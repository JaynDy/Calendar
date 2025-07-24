import React, { useEffect, useState } from "react";
import styles from "./FormEvents.module.css";
import { Icon } from "@@/Icon";
import { Button } from "@@/Button/Button";
import { Input } from "@@/Input/Input";
import { SelectMenu } from "@@/SelectMenu/SelectMenu";
import { timesArray } from "@@/SelectMenu/generateTimesArray";
import classNames from "classnames";
import { Datepicker } from "@@/Datepicker/Datepicker";
import { format } from "date-fns";
import { Checkbox } from "@@/Checkbox";
import { TextArea } from "@@/TextArea/TextArea";
import { setCurrentEvent } from "../../reducers/eventSlice";
import { useDispatch } from "react-redux";
import { getCurrentTimeRoundedTo15Minutes } from "./FormEventsUtil";
import { convertTo24HourFormat } from "../Events/eventUtil";

export const FormEvents = ({
  postQueryCalendars,
  postQueryEvents,
  updateEvent,
  title,
  currentEvent,
  currentDate,
  isFormVisible,
  isEventInfoVisible,
  handleSubmit,
  onClose,
  isReadOnly = false,
  handleDeleteClick,
  handleEditClick,
  periodicityArray,
  onDateChange,
  isDatepickerVisible,
  setIsDatepickerVisible,
  handlePrevMonth,
  handleNextMonth,
  error,
  setError,
  validationErrors,
  reccurenceCurrentEventsLength,
  setIsEditingSinglEvent,
}) => {
  // console.log("FormEvents currentEvent", currentEvent);
  // console.log("FormEvents currentDate ", currentDate);
  // console.log("FormEvents postQueryEvents", postQueryEvents);
  // console.log("FormEvents postQueryCalendars", postQueryCalendars);

  const dispatch = useDispatch();
  const reccurenceCurrentEvent = currentEvent?.recurrenceId;

  const [defaultTimeStart, setDefaultTimeStart] = useState(
    getCurrentTimeRoundedTo15Minutes()
  );
  const [defaultTimeEnd, setDefaultTimeEnd] = useState(
    getCurrentTimeRoundedTo15Minutes()
  );

  useEffect(() => {
    setDefaultTimeStart(currentEvent.time?.startTime || defaultTimeStart);
    setDefaultTimeEnd(currentEvent.time?.endTime || defaultTimeEnd);
  }, [currentEvent.id, currentEvent.time]);

  const selectCalendar = postQueryCalendars.map((calendar) => ({
    id: calendar.id,
    name: calendar.name,
    color: calendar.color,
    isDefault: calendar.isDefault,
    isChecked: calendar.isChecked,
  }));
  // console.log("selectCalendar", selectCalendar);

  const defaultCalendar = selectCalendar.find((calendar) => calendar.isDefault);
  // console.log("defaultCalendar", defaultCalendar);

  useEffect(() => {
    if (currentEvent && (!currentEvent.date || !currentEvent.id)) {
      const updatedEvent = {
        ...currentEvent,
        date: currentEvent?.date || new Date().toISOString(),
        time: {
          startTime: currentEvent.time.startTime || defaultTimeStart,
          endTime: currentEvent.time.endTime || defaultTimeEnd,
        },
        isAllDay: currentEvent.isAllDay || false,
        periodicity: currentEvent?.periodicity || "Does not repeat",
        calendar: currentEvent.calendar?.id
          ? currentEvent.calendar
          : defaultCalendar,
        recurrenceId: currentEvent.recurrenceId || "",
        completed: currentEvent.completed || false,
      };

      if (
        !currentEvent.date ||
        !currentEvent.time.startTime ||
        !currentEvent.calendar?.id
      ) {
        dispatch(setCurrentEvent(updatedEvent));
      }
    }
  }, [
    currentEvent,
    dispatch,
    defaultCalendar,
    defaultTimeStart,
    defaultTimeEnd,
  ]);

  useEffect(() => {
    if (postQueryCalendars && currentEvent) {
      const updatedCalendar = selectCalendar.find(
        (calendar) => calendar.id === currentEvent.calendar?.id
      );
      // console.log("updatedCalendar", updatedCalendar);

      if (updatedCalendar && currentEvent.calendar.id !== updatedCalendar.id) {
        dispatch(
          setCurrentEvent({
            ...currentEvent,
            calendar: updatedCalendar || defaultCalendar,
          })
        );
      }
    }
  }, [postQueryCalendars, currentEvent, selectCalendar, dispatch]);

  useEffect(() => {
    if (postQueryCalendars && postQueryEvents) {
      postQueryCalendars.forEach((calendar) => {
        const eventsToUpdate = postQueryEvents.filter(
          (event) => event.calendar.id === calendar.id
        );

        eventsToUpdate.forEach((event) => {
          const updatedCalendar = selectCalendar.find(
            (cal) => cal.id === calendar.id
          );
          if (event.id && updatedCalendar) {
            const updatedEvents = {
              ...event,
              calendar: updatedCalendar,
            };

            if (
              event.id &&
              JSON.stringify(event.calendar) !==
                JSON.stringify(updatedEvents.calendar)
            ) {
              updateEvent.mutate({
                id: event.id,
                updatedCalendar: {
                  id: updatedEvents.calendar.id,
                  name: updatedEvents.calendar.name,
                  color: updatedEvents.calendar.color,
                  isDefault: updatedEvents.calendar.isDefault,
                  isChecked: updatedEvents.calendar.isChecked,
                },
              });
            }
          }
        });
      });
    }
  }, [postQueryCalendars, postQueryEvents]);

  const handleCalendarChange = (selectedCalendar) => {
    dispatch(setCurrentEvent({ ...currentEvent, calendar: selectedCalendar }));
  };

  const handleTitleChange = (e) => {
    const updatedTitle = e.target.value;
    dispatch(setCurrentEvent({ ...currentEvent, title: updatedTitle }));
    if (!updatedTitle.trim()) {
      validationErrors.title = "Title is required";
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
    } else {
      setError({});
    }
  };

  const handleDateClick = () => {
    setIsDatepickerVisible((prev) => !prev);
  };

  const handleTimeChange = (time, type) => {
    const updatedTime = { ...currentEvent.time, [type]: time };
    dispatch(
      setCurrentEvent({
        ...currentEvent,
        time: updatedTime,
      })
    );
    if (
      updatedTime.startTime &&
      updatedTime.endTime &&
      convertTo24HourFormat(updatedTime.startTime) >
        convertTo24HourFormat(updatedTime.endTime)
    ) {
      validationErrors.time = validationErrors.time || {};
      validationErrors.time.endTime = "Select the correct time";
    } else {
      if (validationErrors.time) {
        delete validationErrors.time.endTime;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
    } else {
      setError({});
    }
  };

  const handleAllDayChange = (e) => {
    const isChecked = e.target.checked;
    dispatch(
      setCurrentEvent({
        ...currentEvent,
        isAllDay: isChecked,
      })
    );
  };

  const handlePeriodicityChange = (option) => {
    dispatch(
      setCurrentEvent({
        ...currentEvent,
        periodicity: option,
      })
    );
  };

  const hanleDescriptionChange = (e) => {
    dispatch(
      setCurrentEvent({
        ...currentEvent,
        description: e.target.value,
      })
    );
  };

  const handleSaveSingleEvent = () => {
    setIsEditingSinglEvent(true);
  };

  const handleSaveGroupEvents = () => {
    setIsEditingSinglEvent(false);
  };

  return (
    <div>
      {isFormVisible && (
        <div className={classNames(styles.formContent)}>
          <form onSubmit={handleSubmit}>
            <div className={styles.titleEvents}>
              <span className={styles.headerEvents}>{title}</span>

              <button type="button" onClick={onClose}>
                <Icon name="Close" className={styles.imgClose} />
              </button>
            </div>
            <hr className={styles.hrForm} />
            <div className={styles.inputContainer}>
              <Icon name="LetterT" className={styles.imgLetterT} />
              <div className={styles.labelInputContainer}>
                <Input
                  name="title"
                  label="Title"
                  placeholder="Enter title"
                  value={currentEvent.title || ""}
                  onChange={handleTitleChange}
                  className={styles.titleInputFormEvents}
                  error={error.title}
                />
              </div>
            </div>
            <div className={styles.selectMenuContainer}>
              <Icon name="Clock" className={styles.imgClock} />
              <div className={styles.selectMenuWrapper}>
                <SelectMenu
                  key={currentEvent.date?.toString()}
                  label="Date"
                  selectedOption={format(currentDate, "EEEE, MMMM d")}
                  id="date-select"
                  hoveredItem
                  selectedItem
                  options={[]}
                  onOptionSelect={handleDateClick}
                />
                {isDatepickerVisible && (
                  <Datepicker
                    iconChevronLeft="ChevronLeft"
                    iconChevronRight="ChevronRight"
                    viewMode="Day"
                    currentEvent={currentEvent}
                    currentDate={currentDate}
                    onDateChange={onDateChange}
                    handlePrevMonth={handlePrevMonth}
                    handleNextMonth={handleNextMonth}
                  />
                )}
                <SelectMenu
                  label="Time"
                  selectedOption={
                    currentEvent.time?.startTime || defaultTimeStart
                  }
                  id="start-time-select"
                  hoveredItem
                  selectedItem
                  options={timesArray}
                  onOptionSelect={(time) => handleTimeChange(time, "startTime")}
                />
                <div className={styles.hyphen}>-</div>
                <div className={styles.containerEndTime}>
                  <SelectMenu
                    label=""
                    selectedOption={
                      currentEvent.time?.endTime || defaultTimeEnd
                    }
                    id="end-time-select"
                    hoveredItem
                    selectedItem
                    options={timesArray}
                    onOptionSelect={(time) => handleTimeChange(time, "endTime")}
                    error={error.time?.endTime}
                  />
                </div>
              </div>
            </div>

            <div className={styles.periodicityContainer}>
              <Checkbox
                id={currentEvent.id}
                label="All day"
                iconChecked="CheckboxFill"
                iconUnchecked="CheckboxLine"
                checked={currentEvent.isAllDay}
                onChange={handleAllDayChange}
                isForAllDay={true}
              />

              {(!currentEvent.id || reccurenceCurrentEventsLength > 1) && (
                <SelectMenu
                  label=""
                  selectedOption={
                    currentEvent?.periodicity || "Does not repeat"
                  }
                  id="periodicity"
                  icon="ChevronDown"
                  hoveredItem
                  selectedItem
                  options={periodicityArray}
                  onOptionSelect={(option) => handlePeriodicityChange(option)}
                  className={styles.imgSelectMenu}
                  key={periodicityArray.join(",")}
                />
              )}
            </div>
            <div className={styles.selectedCalendarContainer}>
              <Icon name="Calendar" className={styles.imgCalendar} />
              <SelectMenu
                label="Calendar"
                selectedOption={currentEvent.calendar || defaultCalendar}
                icon="ChevronDown"
                hoveredItem
                selectedItem
                options={selectCalendar}
                onOptionSelect={(option) => handleCalendarChange(option)}
                className={styles.imgSelectMenu}
              />
            </div>
            <div className={styles.selectedCalendarContainer}>
              <Icon name="Description" className={styles.imgDescription} />
              <TextArea
                description="Description"
                value={currentEvent.description || ""}
                onChange={hanleDescriptionChange}
                name="description"
                placeholder="Enter description"
                rows="1"
                cols=""
              />
            </div>

            <div className={styles.buttonContainer}>
              <Button
                primary
                label="Save"
                className={styles.buttonSave}
                type="submit"
                onClick={handleSaveSingleEvent}
              />
              {reccurenceCurrentEvent && reccurenceCurrentEventsLength > 1 && (
                <Button
                  primary
                  label="Save group"
                  className={styles.buttonSave}
                  type="submit"
                  onClick={handleSaveGroupEvents}
                />
              )}
            </div>
          </form>
        </div>
      )}
      {isEventInfoVisible && (
        <div className={classNames(styles.formContent)}>
          <form onSubmit={handleSubmit}>
            <div className={styles.titleEvents}>
              <span className={styles.headerEvents}>{title}</span>

              <div className={styles.buttonWrapper}>
                {isReadOnly &&
                  postQueryEvents?.map(
                    (event) =>
                      event.id === currentEvent.id && (
                        <div
                          className={styles.buttonFormContainer}
                          key={event.id}
                        >
                          <Icon
                            name="Edit"
                            onClick={() => {
                              handleEditClick(event);
                            }}
                            className={styles.imgEdit}
                          />
                          <Icon
                            name="Delete"
                            onClick={() => handleDeleteClick(event)}
                            className={styles.imgDelete}
                          />
                        </div>
                      )
                  )}

                <button
                  type="button"
                  onClick={onClose}
                  className={styles.closeButton}
                >
                  <Icon name="Close" className={styles.imgClose} />
                </button>
              </div>
            </div>
            <hr className={styles.hrForm} />
            <div
              className={
                isEventInfoVisible
                  ? styles.inputContainerInfo
                  : styles.inputContainer
              }
            >
              <Icon name="LetterT" className={styles.imgLetterT} />
              <div className={styles.labelInputContainer}>
                <Input
                  name="title"
                  label=""
                  placeholder="Enter title"
                  value={currentEvent.title}
                  className={
                    isEventInfoVisible
                      ? styles.titleInputInfo
                      : styles.titleInputFormEvents
                  }
                  readFor={isEventInfoVisible}
                  readOnly
                />
              </div>
            </div>
            <div className={styles.selectMenuContainer}>
              <Icon name="Clock" className={styles.imgClock} />
              <div className={styles.dateContainer}>
                <div className={styles.selectMenuDate}>
                  <div className={styles.buttonSelectMenu}>
                    {format(currentEvent.date, "EEEE, MMMM d")},
                  </div>
                  <div className={styles.buttonSelectMenu}>
                    {currentEvent.time?.startTime}
                  </div>
                  <div className={styles.buttonSelectMenu}>
                    - {currentEvent.time?.endTime}
                  </div>
                </div>
                <div className={styles.periodicityWrapper}>
                  {currentEvent.isAllDay &&
                    postQueryEvents?.map(
                      (event) =>
                        event.id === currentEvent.id && (
                          <div className={styles.allDayCheckbox} key={event.id}>
                            All day
                          </div>
                        )
                    )}
                  {(!currentEvent.id || reccurenceCurrentEventsLength > 1) && (
                    <div className={styles.buttonSelectMenu}>
                      {currentEvent.periodicity}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.calendarContainer}>
              <Icon name="Calendar" className={styles.imgCalendar} />
              <div className={styles.calendar}>
                <div
                  className={styles.colorBox}
                  style={{
                    backgroundColor: currentEvent.calendar.color,
                  }}
                ></div>
                {currentEvent.calendar.name}
              </div>
            </div>
            <div className={styles.selectedDescriptionContainer}>
              <Icon name="Description" className={styles.imgDescription} />
              <div className={styles.textAreaContainer}>
                {currentEvent.description}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
