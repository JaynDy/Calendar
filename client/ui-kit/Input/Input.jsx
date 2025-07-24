import React from "react";
import styles from "./Input.module.css";
import { Icon } from "../Icon/Icon";
import classNames from "classnames";

export const Input = ({
  name,
  label,
  placeholder,
  value,
  error,
  icon,
  disabled,
  filled,
  active,
  onChange,
  className,
  readFor,
  readOnly,
}) => {
  return (
    <div
      className={readFor ? styles.containerInputInfo : styles.containerInput}
    >
      <label htmlFor={name}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={classNames(
            styles.inputName,
            className,
            {
              [styles.disabled]: disabled,
              [styles.filled]: filled,
              [styles.active]: active,
              [styles.error]: error,
              [styles.readFor]: readFor,
            },
            {
              [styles.inputError]: error,
            }
          )}
          readOnly={readOnly}
        />
        {icon && (
          <Icon
            name={icon}
            className={classNames(styles.inputIcon, {
              [styles.iconDisabled]: disabled,
            })}
          />
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
