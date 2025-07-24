const { CalendarsService } = require("../service/calendars.service");
const calendarsService = new CalendarsService();

async function createDefaultCalendar() {
  const defaultCalendar = {
    name: "Calendar 1",
    color: "",
    isChecked: false,
    isDefault: true,
  };

  const existingDefaultCalendar = await calendarsService.findDefaultCalendar();

  if (!existingDefaultCalendar) {
    const isCheckedStatus = defaultCalendar.color
      ? true
      : defaultCalendar.isChecked;
    await calendarsService.addCalendar(
      defaultCalendar.name,
      defaultCalendar.color,
      isCheckedStatus,
      defaultCalendar.isDefault
    );
  } else {
    const updatedName = existingDefaultCalendar.name || defaultCalendar.name;
    const updatedColor = existingDefaultCalendar.color || defaultCalendar.color;
    const isCheckedStatus = defaultCalendar.color
      ? true
      : existingDefaultCalendar.isChecked;

    await calendarsService.updateCalendar(
      existingDefaultCalendar.id,
      updatedName,
      updatedColor,
      isCheckedStatus,
      defaultCalendar.isDefault
    );
  }
}

async function getList(req, res) {
  const listSrc = await calendarsService.getList();
  const list = listSrc.map((el) => {
    return {
      name: el.name,
      color: el.color,
      isChecked: el.isChecked,
      isDefault: el.isDefault,
      id: el.id.toString(),
      createdAt: new Date(el.createdAt).toLocaleString("en-EN"),
    };
  });
  res.json(list);
}

async function getListId(req, res) {
  const id = req.params.id;
  const calendar = await calendarsService.getListId(id);
  res.json(calendar);
}

async function addCalendar(req, res) {
  try {
    const { name, color, isChecked, isDefault } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const newCalendar = await calendarsService.addCalendar(
      name,
      color || "",
      isChecked,
      isDefault
    );
    res.status(201).json(newCalendar);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function toggleChecked(req, res) {
  const { id } = req.body;
  const checkedCalendar = await calendarsService.toggleChecked(id);
  res.status(200).json(checkedCalendar);
}

async function deleteCalendar(req, res) {
  const { id } = req.body;
  const deleteCalendar = await calendarsService.delete(id);
  res.status(200).json(deleteCalendar);
}

async function deleteAllCalendars(req, res) {
  const deleteAllCalendars = await calendarsService.deleteAllCalendars();
  res.status(200).json(deleteAllCalendars);
}

async function updateCalendar(req, res) {
  const calendarId = req.params.id;
  const { updatedText, updatedColor, updatedIsChecked, updatedIsDefault } =
    req.body;

  const updateCalendar = await calendarsService.updateCalendar(
    calendarId,
    updatedText,
    updatedColor || "",
    updatedIsChecked,
    updatedIsDefault
  );
  res.status(200).json(updateCalendar);
}

module.exports = {
  createDefaultCalendar,
  getList,
  getListId,
  addCalendar,
  toggleChecked,
  deleteCalendar,
  deleteAllCalendars,
  updateCalendar,
};
