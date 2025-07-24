import React from "react";
import styles from "./Toast.module.css";
import { Icon } from "../Icon/Icon";

export const Toast = ({ message, onClose, icon }) => {
  return (
    <div className={styles.toastContainer}>
      <div className={styles.toastMessage}>{message}</div>
      <button className={styles.toastClose} onClick={onClose}>
        <Icon name={icon} />
      </button>
    </div>
  );
};
