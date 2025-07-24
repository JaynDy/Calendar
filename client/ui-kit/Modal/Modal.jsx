import React from "react";
import styles from "./Modal.module.css";
import { Icon } from "../Icon/Icon";
import { Button } from "../Button/Button";

export const Modal = ({
  onClose,
  title,
  icon,
  children,
  isFormDeleteVisible,
  currentEvent,
  onDeleteEvent,
  onDeleteCalendar,
  onDeleteRecurrenceEvent,
  reccurenceCurrentEventsLength,
}) => {
  if (!isFormDeleteVisible) return null;

  const reccurenceCurrentEvent = currentEvent?.recurrenceId;

  return (
    <div>
      {isFormDeleteVisible && (
        <div
          className={
            onDeleteEvent ? styles.modalOverlayEvent : styles.modalOverlay
          }
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.headerModal}>{title}</h2>
              <button className={styles.modalClose} onClick={onClose}>
                <Icon name={icon} />
              </button>
            </div>
            <hr className={styles.hrComponent} />
            <div className={styles.modalBody}>{children}</div>
          </div>
          <div className={styles.containerButton}>
            <Button
              pressed
              hover
              label="Cancel"
              className={styles.buttonCancel}
              type="button"
              onClick={onClose}
            />
            <Button
              primary
              pressed
              hover
              label="Delete"
              className={styles.buttonDelete}
              type="button"
              onClick={onDeleteEvent || onDeleteCalendar}
            />
            {reccurenceCurrentEvent && reccurenceCurrentEventsLength > 1 && (
              <Button
                primary
                pressed
                hover
                label="Delete group"
                className={styles.buttonDelete}
                type="button"
                onClick={onDeleteRecurrenceEvent}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
