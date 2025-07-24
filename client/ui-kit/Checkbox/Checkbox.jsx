import React, { useState } from "react";
import styles from "./Checkbox.module.css";
import { Icon } from "../Icon/Icon";

export const Checkbox = ({
  id,
  label,
  iconChecked,
  iconUnchecked,
  color,
  checked,
  onChange,
  isForAllDay = false,
}) => {
  // console.log("color", color);

  return (
    <div className={styles.checkboxContainer}>
      <input
        id={color ? `checkbox-${id}` : `allDay-${id}`}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.checkboxInput}
      />
      {!isForAllDay ? (
        <label htmlFor={`checkbox-${id}`} className={styles.label}>
          {color && (
            <Icon
              className={styles.iconChecked}
              name={checked ? iconChecked : iconUnchecked}
              style={{ fill: color }}
            />
          )}
          {color === "" && (
            <Icon
              name={iconUnchecked}
              style={{ fill: "rgba(66, 148, 136, 1)" }}
            />
          )}
          <span className={styles.spanCheckbox}>{label}</span>
        </label>
      ) : (
        <label htmlFor={`allDay-${id}`} className={styles.label}>
          {checked ? (
            <Icon
              className={styles.iconChecked}
              name={iconChecked}
              style={{ fill: "rgba(0, 174, 28, 1)" }}
            />
          ) : (
            <Icon
              name={iconUnchecked}
              style={{ fill: "rgba(0, 174, 28, 1)" }}
            />
          )}
          <span className={styles.spanCheckbox}>{label}</span>
        </label>
      )}
    </div>
  );
};
