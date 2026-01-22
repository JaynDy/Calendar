const { EventsService } = require("../service/events.service");
const eventsService = new EventsService();

async function getList(req, res) {
  const listSrc = await eventsService.getList();
  const list = listSrc.map((el) => {
    return {
      title: el.title,
      date: el.date,
      time: el.time,
      periodicity: el.periodicity,
      isAllDay: el.isAllDay,
      calendar: el.calendar,
      description: el.description,
      recurrenceId: el.recurrenceId,
      completed: el.completed,
      id: el.id.toString(),
      createdAt: new Date(el.createdAt).toLocaleString("en-EN"),
    };
  });
  res.json(list);
}

async function getListId(req, res) {
  const id = req.params.id;
  const event = await eventsService.getListId(id);
  res.json(event);
}

async function addEvent(req, res) {
  try {
    const {
      title,
      date,
      time,
      isAllDay,
      periodicity,
      calendar,
      description,
      recurrenceId,
      completed,
    } = req.body;

    const newEvent = await eventsService.addEvent(
      title,
      date,
      time,
      isAllDay,
      periodicity,
      calendar,
      description,
      recurrenceId,
      completed,
    );
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Internal Server Error" + error.message });
  }
}

async function toggleComplete(req, res) {
  const { id } = req.body;
  const completeEvent = await eventsService.toggleComplete(id);
  // console.log("completeEvent", completeEvent);
  res.status(200).json(completeEvent);
}

async function deleteEvent(req, res) {
  const { id } = req.body;
  const deleteEvent = await eventsService.delete(id);
  res.status(200).json(deleteEvent);
}

async function deleteAllEvents(req, res) {
  const deleteAllEvents = await eventsService.deleteAll();
  res.status(200).json(deleteAllEvents);
}

async function deleteAllCalendarEvents(req, res) {
  const { calendarId } = req.body;

  if (!calendarId) {
    return res.status(400).json({ message: "Calendar ID is required" });
  }
  const deleteEvents = await eventsService.deleteAllCalendarEvents(calendarId);
  // console.log("Deleted events:", deleteEvents);
  res.status(200).json(deleteEvents);
}

async function deleteAllRecurrenceEvents(req, res) {
  const { recurrenceId } = req.body;
  try {
    const deleteAllRecurrenceEvents =
      await eventsService.deleteAllReccurence(recurrenceId);
    res.status(200).json(deleteAllRecurrenceEvents);
  } catch (error) {
    console.error("Error deleting events:", error);
    res.status(500).json({ message: "Error deleting events", error });
  }
}

async function updateEvent(req, res) {
  const eventId = req.params.id;
  console.log("Received body:", req.body);

  const {
    updatedText,
    updatedDate,
    updatedTime,
    updatedIsAllDay,
    updatedPeriodicity,
    updatedCalendar,
    updatedDescription,
    updatedRecurrenceId,
    updatedCompleted,
  } = req.body;

  const updateEvent = await eventsService.updateEvent(
    eventId,
    updatedText,
    updatedDate,
    updatedTime,
    updatedIsAllDay,
    updatedPeriodicity,
    updatedCalendar,
    updatedDescription,
    updatedRecurrenceId,
    updatedCompleted,
  );
  // const updateEvent = await eventsService.updateEvent(eventId, req.body);
  res.status(200).json(updateEvent);
}

async function updateAllRecurenceEvents(req, res) {
  const recurrenceId = req.params.recurrenceId;
  const updatedEvents = req.body;

  try {
    const updatedEventGroup = await eventsService.updateAllRecurrenceEvents(
      recurrenceId,
      updatedEvents,
    );
    console.log("Number of updated documents:", updatedEventGroup);
    res.status(200).json(updatedEventGroup);
  } catch (error) {
    console.error("Error updating recurrence events:", error);
    res.status(500).json({ error: "Failed to update recurrence events" });
  }
}

module.exports = {
  getList,
  getListId,
  addEvent,
  toggleComplete,
  deleteEvent,
  deleteAllEvents,
  deleteAllCalendarEvents,
  deleteAllRecurrenceEvents,
  updateEvent,
  updateAllRecurenceEvents,
};
