import React, { useState } from "react";
import styles from "./Header.module.css";
import ImgLogo from "../../icons/ImgLogo.svg";
import { optionsArray } from "@@/Dropdown/DropdownUtil";
import { Datepicker } from "@@/Datepicker/Datepicker";
import { Dropdown } from "@@/Dropdown/Dropdown";
import { Button } from "@@/Button/Button";
import { Icon } from "@@/Icon/Icon";
import { setCurrentEvent } from "../../reducers/eventSlice";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { monthNames } from "@@/Datepicker/calendarUtils";

export const Header = ({
  user,
  currentDate,
  viewMode,
  setViewMode,
  onDateChange,
  currentEvent,
  handlePrevMonth,
  handleNextMonth,
}) => {
  const dispatch = useDispatch();
  // console.log("Header currentDate", currentDate);

  const handleTodayClick = () => {
    dispatch(setCurrentEvent({ date: new Date().toISOString() }));
  };

  const handleOptionChange = (option) => {
    setViewMode(option);
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    dispatch(setCurrentEvent({ date: newDate.toISOString() }));
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    dispatch(setCurrentEvent({ date: newDate.toISOString() }));
    onDateChange(newDate);
  };

  const headerDate =
    viewMode === "Day"
      ? format(new Date(currentDate), "EEEE, MMMM d")
      : `${monthNames[new Date(currentDate).getMonth()]} ${new Date(
          currentDate
        ).getFullYear()}`;

  // console.log("Header Date:", headerDate);

  return (
    <header>
      <div className={styles.headerContainerleft}>
        <div className={styles.logotip}>
          <img src={ImgLogo} alt="" />
          WebCalendar
        </div>
        <Button
          primary
          label="Today"
          className={styles.todayButton}
          onClick={handleTodayClick}
        ></Button>
        <div className={styles.controlsStart}>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={viewMode === "Day" ? handlePrevDay : handlePrevMonth}
              className={styles.imgBorder}
            >
              <Icon className={styles.chevronIcon} name="ChevronLeft" />
            </button>
            <button
              type="button"
              onClick={viewMode === "Day" ? handleNextDay : handleNextMonth}
              className={styles.imgBorder}
            >
              <Icon className={styles.chevronIcon} name="ChevronRight" />
            </button>
          </div>
          <div>{headerDate}</div>
        </div>
        <Datepicker
          iconChevronLeft="ChevronLeft"
          iconChevronRight="ChevronRight"
          className={styles.imgBorder}
          viewMode={viewMode}
          currentEvent={currentEvent}
          currentDate={currentDate}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          onDateChange={onDateChange}
        />
      </div>
      <div className={styles.headerContainerRight}>
        <Dropdown
          defaultOption="Week"
          icon="DownSmall"
          options={optionsArray}
          className={styles.buttonSize}
          onOptionChange={handleOptionChange}
        />
        <div className={styles.usernameButton}>
          <div className={styles.username}>{user.displayName}</div>
          <div className={styles.userNameCircle}>
            {user.displayName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
