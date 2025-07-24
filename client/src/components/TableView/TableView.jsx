import { useState, useEffect } from "react";
import styles from "./TableView.module.css";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parse,
} from "date-fns";
import { useDispatch } from "react-redux";
import { setCurrentEvent } from "../../reducers/eventSlice";
import classNames from "classnames";
import { EventAllDay } from "../EventAllDay.jsx";
import { EventCell } from "../EventCell.jsx/EventCell.jsx";

export const TableView = ({
  viewMode,
  postQueryEvents,
  currentDate,
  setIsEventInfoVisible,
}) => {
  const dispatch = useDispatch();
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [formattedDateDay, setFormattedDateDay] = useState("");
  const [formattedDateDayWeek, setFormattedDateDayWeek] = useState("");

  // console.log("daysOfWeek", daysOfWeek);

  const handleEventClick = (event) => {
    dispatch(setCurrentEvent(event));
    setIsEventInfoVisible(true);
  };

  useEffect(() => {
    const updateDaysOfWeek = () => {
      const today = new Date();
      let startOfWeekDate, endOfWeekDate;

      if (currentDate) {
        startOfWeekDate = startOfWeek(new Date(currentDate), {
          weekStartsOn: 0,
        });
        endOfWeekDate = endOfWeek(new Date(currentDate), { weekStartsOn: 0 });
      } else {
        startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 });
        endOfWeekDate = endOfWeek(today, { weekStartsOn: 0 });
      }

      const days = eachDayOfInterval({
        start: startOfWeekDate,
        end: endOfWeekDate,
      });
      setDaysOfWeek(days);

      if (viewMode === "Day" && currentDate) {
        const minDate = new Date(currentDate);
        setFormattedDateDay(format(minDate, "d"));
        setFormattedDateDayWeek(format(minDate, "EEEE").toLowerCase());
      }
    };
    updateDaysOfWeek();
  }, [postQueryEvents, viewMode, currentDate]);

  const formatHour12 = (hour) => {
    const period = hour < 12 ? "am" : "pm";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${period}`;
  };

  const parseTimeString = (timeString) => {
    let sanitizedTimeString = timeString.trim();
    let parsedTime = parse(sanitizedTimeString, "h:mm a", new Date());
    return parsedTime;
  };

  return (
    <div className={styles.dayViewContainer}>
      <div className={styles.tableWrapper}>
        <table
          className={classNames(
            viewMode === "Week" ? styles.hourTable : styles.hourTableForDayView
          )}
        >
          <thead>
            {viewMode === "Week" && (
              <tr className={styles.dayHeaderRow}>
                <td className={classNames(styles.firstTd)}></td>
                {daysOfWeek.map((day, index) => (
                  <td key={index} className={styles.dateHeaderDay}>
                    <div
                      className={styles.dateContainer}
                      style={{
                        backgroundColor:
                          currentDate?.getDate() === day.getDate() &&
                          currentDate?.getMonth() === day.getMonth() &&
                          currentDate?.getFullYear() === day.getFullYear()
                            ? "rgba(223, 245, 226, 1)"
                            : "transparent",
                      }}
                    >
                      <div>{format(day, "d")}</div>
                      <div className={styles.dateHeaderDayWeek}>
                        {format(day, "EE").toLowerCase()}
                      </div>
                    </div>
                    <EventAllDay
                      viewMode={viewMode}
                      postQueryEvents={postQueryEvents}
                      day={day}
                      onEventClick={handleEventClick}
                    />
                  </td>
                ))}
              </tr>
            )}
            {viewMode === "Day" && (
              <tr className={styles.dayViewWrapper}>
                <td className={classNames(styles.firstTdForDayView)}></td>
                <td colSpan={daysOfWeek.length || 1}>
                  <button className={styles.formattedDateButton}>
                    <div className={styles.dateDay}>
                      {formattedDateDay}
                      <div className={styles.dateDayWeek}>
                        {formattedDateDayWeek}
                      </div>
                    </div>
                  </button>
                  <EventAllDay
                    viewMode={viewMode}
                    postQueryEvents={postQueryEvents}
                    currentDate={currentDate}
                    onEventClick={handleEventClick}
                  />
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {[...Array(24)].map((_, hour) => (
              <tr key={hour} className={styles.hourHeaderCol}>
                <td className={styles.hourCell}>
                  {hour === 0 ? null : formatHour12(hour)}
                </td>

                {viewMode === "Week" &&
                  daysOfWeek.map((day, dayIndex) => (
                    <td key={dayIndex} className={styles.eventCell}>
                      <div key={hour} className={styles.hourWrapper}>
                        <EventCell
                          viewMode={viewMode}
                          postQueryEvents={postQueryEvents}
                          hour={hour}
                          day={day}
                          dayIndex={dayIndex}
                          onEventClick={handleEventClick}
                          parseTimeString={parseTimeString}
                        />
                      </div>
                    </td>
                  ))}
                {viewMode === "Day" && (
                  <td key={hour} className={styles.eventCell}>
                    <div key={hour} className={styles.hourWrapper}>
                      <EventCell
                        viewMode={viewMode}
                        postQueryEvents={postQueryEvents}
                        hour={hour}
                        currentDate={currentDate}
                        onEventClick={handleEventClick}
                        parseTimeString={parseTimeString}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
