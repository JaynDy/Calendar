import React from "react";
import styles from "./Datepicker.module.css";
import { Icon } from "@@/Icon";
import { renderCalendar, monthNames, daysOfWeek } from "./calendarUtils";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { setCurrentEvent } from "@/reducers/eventSlice";

export const Datepicker = ({
  iconChevronLeft,
  iconChevronRight,
  currentDate,
  onDateChange,
  handlePrevMonth,
  handleNextMonth,
}) => {
  const dispatch = useDispatch();
  // console.log("Datepicker currentDate:", currentDate);

  const handleDateClick = (day, className) => {
    if (className === "prevMonthDay" || className === "nextMonthDay") return;
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    dispatch(setCurrentEvent({ date: newDate.toISOString() }));
    onDateChange(newDate);
    // console.log("Datepicker newDate", newDate);
  };

  return (
    <>
      <div className={styles.datePickerContainer}>
        <div className={styles.controls}>
          <div>{`${monthNames[new Date(currentDate).getMonth()]} ${new Date(
            currentDate,
          ).getFullYear()}`}</div>
          <div className={styles.buttonContainer}>
            <button type="button" onClick={handlePrevMonth}>
              <Icon className={styles.chevronIcon} name={iconChevronLeft} />
            </button>
            <button type="button" onClick={handleNextMonth}>
              <Icon className={styles.chevronIcon} name={iconChevronRight} />
            </button>
          </div>
        </div>
        <div className={styles.weekdays}>
          {daysOfWeek.map((day, index) => (
            <div key={index} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.dates}>
          {renderCalendar(currentDate).days.map((item, index) => (
            <div
              key={index}
              className={classNames(styles.day, {
                [styles.today]:
                  item.className === "today" && currentDate === null,
                [styles.prevMonthDay]: item.className === "prevMonthDay",
                [styles.nextMonthDay]: item.className === "nextMonthDay",
                [styles.selectedDay]:
                  item.date?.toDateString() === currentDate?.toDateString(),
              })}
              onClick={() => handleDateClick(item.day, item.className)}
              onChange={onDateChange}
            >
              {item.day}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
