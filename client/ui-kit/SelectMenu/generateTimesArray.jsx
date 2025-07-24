export const generateTimesArray = (start, end, step) => {
  const times = [];
  const [startHour, startMinutes, startPeriod] = start.split(/[: ]/);
  const [endHour, endMinutes, endPeriod] = end.split(/[: ]/);

  let hour = parseInt(startHour, 10);
  let minutes = parseInt(startMinutes, 10);
  let period = startPeriod;

  while (true) {
    if (
      hour === parseInt(endHour, 10) &&
      minutes === parseInt(endMinutes, 10) &&
      period === endPeriod
    ) {
      break;
    }

    const formattedHour = hour === 0 ? 12 : hour;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    times.push(`${formattedHour}:${formattedMinutes} ${period}`);

    minutes += step;
    if (minutes >= 60) {
      minutes -= 60;
      hour += 1;
      if (hour === 12) {
        period = period === "am" ? "pm" : "am";
      } else if (hour > 12) {
        hour = 1;
      }
    }
  }
  return times;
};

export const timesArray = generateTimesArray("12:00 am", "11:45 pm", 15);
