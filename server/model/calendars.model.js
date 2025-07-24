const { model } = require("mongoose");
const { CalendarsSchema } = require("../schema/calendars.schema");

const CalendarsModel = model("Calendar", CalendarsSchema);

module.exports = {
  CalendarsModel,
};
