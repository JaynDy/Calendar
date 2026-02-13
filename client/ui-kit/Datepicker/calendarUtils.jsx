export const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export const renderCalendar = (currentDate) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = [];

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevMonthYear);

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    days.push({
      day,
      date: new Date(prevMonthYear, prevMonth, day),
      className: "prevMonthDay",
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === today.getDate();
    days.push({
      day,
      date: new Date(year, month, day),
      className: isToday ? "today" : "",
    });
  }

  const totalDays = days.length;
  const remainingDays = 42 - totalDays;

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      date: new Date(nextMonthYear, nextMonth, day),
      className: "nextMonthDay",
    });
  }

  return { days };
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
