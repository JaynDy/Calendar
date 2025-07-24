import styles from "./EventCell.module.css";

export const EventCell = ({
  viewMode,
  postQueryEvents,
  hour,
  day,
  currentDate,
  onEventClick,
  parseTimeString,
}) => {
  return (
    <>
      {postQueryEvents
        ?.filter((event) => event.calendar.isChecked)
        .map((event) => {
          if (!event.isAllDay) {
            const eventDate = new Date(event.date);
            const eventStartTime = parseTimeString(event.time.startTime);
            const eventEndTime = parseTimeString(event.time.endTime);

            const isSameDay = (eventDate, targetDate) => {
              return (
                eventDate.getFullYear() === targetDate.getFullYear() &&
                eventDate.getMonth() === targetDate.getMonth() &&
                eventDate.getDate() === targetDate.getDate()
              );
            };

            if (
              (viewMode === "Week" && isSameDay(eventDate, day)) ||
              (viewMode === "Day" && isSameDay(eventDate, currentDate))
            ) {
              const eventStartHour = eventStartTime.getHours();
              if (hour === eventStartHour) {
                const eventStartMinute = eventStartTime.getMinutes();
                const eventTop = (eventStartMinute / 60) * 100;
                const totalEventDurationInMinutes =
                  (eventEndTime.getTime() - eventStartTime.getTime()) /
                  (1000 * 60);
                const eventHeight = (totalEventDurationInMinutes / 60) * 100;

                const overlappingEvents = postQueryEvents.filter(
                  (otherEvent) => {
                    if (otherEvent.isAllDay) return false;
                    const otherEventStartTime = parseTimeString(
                      otherEvent.time.startTime
                    );
                    return (
                      isSameDay(new Date(otherEvent.date), eventDate) &&
                      otherEventStartTime.getHours() === hour
                    );
                  }
                );

                const overlappingEventIndex = overlappingEvents.findIndex(
                  (e) => e.id === event.id
                );
                const eventWidth =
                  viewMode === "Week"
                    ? 96 / overlappingEvents.length
                    : 100 / overlappingEvents.length;
                const eventLeft = overlappingEventIndex * eventWidth;

                return (
                  <div
                    key={event.id}
                    className={styles.eventTableContainer}
                    style={{
                      backgroundColor: `rgba(${event.calendar.color
                        .slice(1)
                        .match(/.{2}/g)
                        .map((hex) => parseInt(hex, 16))
                        .join(",")}, 0.5)`,
                      height: `${eventHeight}px`,
                      top: `${eventTop}%`,
                      width: `${eventWidth}%`,
                      left: `${eventLeft}%`,
                      position: "absolute",
                    }}
                    onClick={() => onEventClick(event)}
                  >
                    <div
                      className={styles.verticalLine}
                      style={{
                        backgroundColor: event.calendar.color,
                      }}
                    ></div>
                    <div className={styles.datasEvent}>{event.title}</div>
                    <div className={styles.datasEvent}>
                      {event.time.startTime === event.time.endTime
                        ? event.time.startTime
                        : `${event.time.startTime} - ${event.time.endTime}`}
                    </div>
                  </div>
                );
              }
            }
          }
          return null;
        })}
    </>
  );
};
