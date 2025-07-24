const { CalendarsModel } = require("../model/calendars.model");

class CalendarsService {
  calendarsModel;

  constructor() {
    this.calendarsModel = CalendarsModel;
  }

  getList() {
    return this.calendarsModel.find({}).sort({ createdAt: -1 }).exec();
  }

  getListId(id) {
    return this.calendarsModel.findById(id).exec();
  }

  addCalendar(name, color, isChecked, isDefault) {
    return this.calendarsModel.create({ name, color, isChecked, isDefault });
  }

  delete(id) {
    return this.calendarsModel.findByIdAndDelete(id).exec();
  }

  deleteAllCalendars() {
    return this.calendarsModel.deleteMany({}).exec();
  }

  async toggleChecked(id) {
    const previous = await this.calendarsModel.findById(id).exec();

    return this.calendarsModel
      .findByIdAndUpdate(
        id,
        {
          isChecked: !previous.isChecked,
        },
        { new: true }
      )
      .exec();
  }

  async updateCalendar(
    id,
    updatedText,
    updatedColor,
    updatedIsChecked,
    updatedIsDefault
  ) {
    const updatedCalendar = await this.calendarsModel
      .findByIdAndUpdate(
        id,
        {
          name: updatedText,
          color: updatedColor || "",
          isChecked: updatedIsChecked,
          isDefault: updatedIsDefault,
        },
        { new: true }
      )
      .exec();

    return updatedCalendar;
  }

  async findDefaultCalendar() {
    return this.calendarsModel.findOne({ isDefault: true }).exec();
  }
}

module.exports = {
  CalendarsService,
};
