const express = require("express");
const router = express.Router();
const calendarController = require("../controller/calendars.controller");
const eventsController = require("../controller/events.controller");

router.get("/calendars", calendarController.getList);
router.get("/calendars/:id", calendarController.getListId);
router.post("/addCalendar", calendarController.addCalendar);
router.post("/checkedCalendar", calendarController.toggleChecked);
router.post("/deleteCalendar", calendarController.deleteCalendar);
router.post("/deleteAllCalendars", calendarController.deleteAllCalendars);
router.put("/updateCalendar/:id", calendarController.updateCalendar);

router.get("/events", eventsController.getList);
router.get("/events/:id", eventsController.getListId);
router.post("/addEvent", eventsController.addEvent);
router.post("/completeEvent", eventsController.toggleComplete);
router.post("/deleteEvent", eventsController.deleteEvent);
router.post("/deleteAllEvents", eventsController.deleteAllEvents);
router.post(
  "/deleteAllCalendarEvents",
  eventsController.deleteAllCalendarEvents
);
router.post(
  "/deleteAllRecurrenceEvents",
  eventsController.deleteAllRecurrenceEvents
);
router.put("/updateEvent/:id", eventsController.updateEvent);
router.put(
  "/updateAllRecurrenceEvents/:recurrenceId",
  eventsController.updateAllRecurenceEvents
);

module.exports = router;
