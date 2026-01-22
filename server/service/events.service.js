const { EventsModel } = require("../model/events.model");

class EventsService {
  eventsModel;

  constructor() {
    this.eventsModel = EventsModel;
  }

  getList() {
    return this.eventsModel.find({}).sort({ createdAt: -1 }).exec();
  }

  getListId(id) {
    return this.eventsModel.findById(id).exec();
  }

  addEvent(
    title,
    date,
    time,
    isAllDay,
    periodicity,
    calendar,
    description,
    recurrenceId,
    completed,
  ) {
    try {
      return this.eventsModel.create({
        title,
        date,
        time,
        isAllDay,
        periodicity,
        calendar,
        description,
        recurrenceId,
        completed,
      });
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  }

  delete(id) {
    return this.eventsModel.findByIdAndDelete(id).exec();
  }

  deleteAll() {
    return this.eventsModel.deleteMany({}).exec();
  }

  deleteAllCalendarEvents(calendarId) {
    return this.eventsModel.deleteMany({ "calendar.id": calendarId }).exec();
  }

  deleteAllReccurence(recurrenceId) {
    return this.eventsModel.deleteMany({ recurrenceId }).exec();
  }

  async toggleComplete(id) {
    const previous = await this.eventsModel.findById(id).exec();

    return this.eventsModel
      .findByIdAndUpdate(
        id,
        {
          completed: !previous.completed,
        },
        { new: true },
      )
      .exec();
  }

  async updateEvent(
    id,
    updatedText,
    updatedDate,
    updatedTime,
    updatedIsAllDay,
    updatedPeriodicity,
    updatedCalendar,
    updatedDescription,
    updatedRecurrenceId,
    updatedCompleted,
  ) {
    const updatedEvent = await this.eventsModel
      .findByIdAndUpdate(
        id,
        {
          title: updatedText,
          date: updatedDate,
          time: updatedTime,
          isAllDay: updatedIsAllDay,
          periodicity: updatedPeriodicity,
          calendar: updatedCalendar,
          description: updatedDescription,
          recurrenceId: updatedRecurrenceId,
          completed: updatedCompleted,
        },
        { new: true },
      )
      .exec();

    return updatedEvent;
  }

  // async updateEvent(id, updatedFields) {
  //   const updatedEvent = await this.eventsModel
  //     .findByIdAndUpdate(
  //       id,
  //       { $set: updatedFields },
  //       { new: true, runValidators: true },
  //     )
  //     .exec();
  //   return updatedEvent;
  // }

  async updateAllRecurrenceEvents(recurrenceId, updates) {
    const recurringEvents = await this.eventsModel
      .find({ recurrenceId })
      .exec();

    const updatedEventList = await Promise.all(
      recurringEvents.map((event) => {
        const updatedEvent = updates.find((updated) => updated.id === event.id);
        if (!updatedEvent) return null;

        return this.eventsModel
          .findByIdAndUpdate(
            event.id,
            {
              title: updatedEvent.updatedText,
              date: updatedEvent.updatedDate,
              time: updatedEvent.updatedTime,
              isAllDay: updatedEvent.updatedIsAllDay,
              periodicity: updatedEvent.updatedPeriodicity,
              calendar: updatedEvent.updatedCalendar,
              description: updatedEvent.updatedDescription,
              recurrenceId: updatedEvent.updatedRecurrenceId,
              completed: updatedEvent.updatedCompleted,
            },
            { new: true },
          )
          .exec();
      }),
    );

    return updatedEventList.filter(Boolean);
  }
}

module.exports = {
  EventsService,
};
