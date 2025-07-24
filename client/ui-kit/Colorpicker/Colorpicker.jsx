import React from "react";
import styles from "./Colorpicker.module.css";
import classNames from "classnames";

export const ColorPicker = ({ type, colors, onColorSelect, pickedColor }) => {
  // console.log("ColorPicker - pickedColor:", pickedColor);

  return (
    <div className={styles.colorPickerContainer}>
      {colors.map((color) => (
        <div
          key={color}
          className={classNames(styles.colorButtonWrapper, {
            [styles.picked]: pickedColor === color,
          })}
        >
          <button
            type={type}
            className={styles.colorButton}
            style={{ backgroundColor: color }}
            onClick={() => {
              onColorSelect(color);
            }}
          ></button>
        </div>
      ))}
    </div>
  );
};
