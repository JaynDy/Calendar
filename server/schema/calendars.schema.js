const { Schema } = require("mongoose");

const CalendarsSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, default: "" },
  isDefault: { type: Boolean, default: false },
  isChecked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = { CalendarsSchema };
