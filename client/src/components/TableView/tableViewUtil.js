// import { parse } from "date-fns";

// export const getEventDurationInCells = (startTime, endTime) => {
//   const parseTimeString = (timeString) => {
//     return parse(timeString, "h:mm a", new Date());
//   };

//   const start = parseTimeString(startTime);
//   const end = parseTimeString(endTime);

//   const durationInMinutes = (end - start) / (1000 * 60);
//   const durationInCells = Math.ceil(durationInMinutes / 15);

//   return durationInCells;
// };

// export const isInEventPeriod = (event, day, hour) => {
//   const eventStart = parse(event.time.startTime, "h:mm a", new Date());
//   const eventEnd = parse(event.time.endTime, "h:mm a", new Date());

//   const eventDay = parse(event.date, "EEEE, MMMM d", new Date()).getDay();
//   const eventStartHour = eventStart.getHours();
//   const eventEndHour = eventEnd.getHours();

//   const isSameDay = eventDay === day;
//   const isWithinHour = hour >= eventStartHour && hour < eventEndHour;

//   return isSameDay && isWithinHour;
// };
