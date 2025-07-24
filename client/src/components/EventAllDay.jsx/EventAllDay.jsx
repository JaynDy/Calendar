import styles from "./EventAllDay.module.css";
import classNames from "classnames";

export const EventAllDay = ({
  viewMode,
  postQueryEvents,
  day,
  currentDate,
  onEventClick,
}) => {
  return (
    <div className={styles.eventAllDayContainer}>
      {postQueryEvents
        ?.filter((event) => {
          const eventDate = new Date(event.date);
          const isCalendarChecked = event.calendar?.isChecked;

          return (
            isCalendarChecked &&
            (viewMode === "Week"
              ? event.isAllDay &&
                eventDate.getFullYear() === day.getFullYear() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getDate() === day.getDate()
              : event.isAllDay &&
                eventDate.getFullYear() === currentDate.getFullYear() &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getDate() === currentDate.getDate())
          );
        })
        ?.map((event) => (
          <div
            key={event.id}
            className={styles.eventTableContainer}
            style={{
              backgroundColor: `rgba(${event.calendar.color
                .slice(1)
                .match(/.{2}/g)
                .map((hex) => parseInt(hex, 16))
                .join(",")}, 0.5)`,
              width: viewMode === "Week" ? "96%" : "100%",
            }}
            onClick={() => onEventClick(event)}
          >
            <div
              className={classNames(styles.verticalLine)}
              style={{
                backgroundColor: event.calendar.color,
              }}
            ></div>
            <div className={styles.datasEvent}>{event.title}</div>
          </div>
        ))}
    </div>
  );
};
