const { model } = require("mongoose");
const { EventsSchema } = require("../schema/events.schema");

const EventsModel = model("Event", EventsSchema);

module.exports = {
  EventsModel,
};
