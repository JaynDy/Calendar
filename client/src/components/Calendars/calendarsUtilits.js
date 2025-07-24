import styles from "./Calendars.module.css";

export const autoResizeTextarea = (element) => {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

export const updateLineHeights = () => {
  const linesVlStart = document.querySelectorAll(`.${styles.vlStartCalendar}`);

  linesVlStart.forEach((line) => {
    const parentLi = line.closest("li");
    if (parentLi) {
      const editSpan = parentLi.querySelector(`.${styles.editSpan}`);
      if (editSpan) {
        line.style.height = `${editSpan.offsetHeight}px`;
      }
    }
  });
};
