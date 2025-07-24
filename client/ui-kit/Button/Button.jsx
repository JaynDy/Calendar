import React from "react";
import styles from "./Button.module.css";
import { Icon } from "../Icon/Icon";
import classNames from "classnames";

export const Button = ({
  type,
  primary,
  label,
  icon,
  disabled,
  hover,
  pressed,
  theme,
  className,
  onClick,
}) => {
  const mode = primary ? styles.buttonPrimary : styles.buttonSecondary;
  const themeClass = theme === "dark" ? styles.darkTheme : "";

  return (
    <button
      type={type}
      className={classNames(styles.button, mode, themeClass, className, {
        [styles.disabled]: disabled,
        [styles.hover]: hover,
        [styles.active]: pressed,
      })}
      onClick={onClick}
    >
      {icon && (
        <Icon
          name={icon}
          className={classNames(styles.buttonIcon, {
            [styles.iconDisabled]: disabled,
          })}
        />
      )}
      {label}
    </button>
  );
};
