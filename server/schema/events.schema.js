const { Schema } = require("mongoose");

const EventsSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  description: { type: String, default: "" },
  isAllDay: { type: Boolean, default: false },
  periodicity: { type: String, default: "" },
  calendar: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
    isChecked: { type: Boolean, required: true },
  },
  recurrenceId: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { EventsSchema };
