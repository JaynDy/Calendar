import React from "react";
import styles from "./FormCalendar.module.css";
import { ColorPicker } from "@@/Colorpicker/Colorpicker";
import { colors } from "@@/Colorpicker/colorsUtil";
import { Icon } from "@@/Icon";
import { Button } from "@@/Button/Button";
import { Input } from "@@/Input/Input";
import { useDispatch } from "react-redux";
import { setCurrentCalendar } from "../../reducers/calendarSlice";

export const FormCalendar = ({
  title,
  currentCalendar,
  isFormVisible,
  handleSubmit,
  onClose,
  error,
}) => {
  // console.log("FormCalendar currentCalendar", currentCalendar);

  const dispatch = useDispatch();
  const handleTitleChange = (e) => {
    dispatch(
      setCurrentCalendar({
        ...currentCalendar,
        name: e.target.value,
      })
    );
  };
  const handleColorSelect = (color) => {
    dispatch(setCurrentCalendar({ ...currentCalendar, color }));
  };

  return (
    <div>
      {isFormVisible && (
        <div className={styles.formContent}>
          <form onSubmit={handleSubmit}>
            <div className={styles.titleCalendar}>
              <span className={styles.headerCalendars}>{title}</span>
              <button type="button" onClick={onClose}>
                <Icon name="Close" className={styles.imgClose} />
              </button>
            </div>
            <hr className={styles.hrForm} />
            <div className={styles.inputContainer}>
              <Icon name="LetterT" className={styles.imgLetterT} />
              <div className={styles.labelInputContainer}>
                <Input
                  name="title"
                  label="Title"
                  placeholder="Enter title"
                  value={currentCalendar.name}
                  onChange={handleTitleChange}
                  className={styles.titleInputForm}
                  error={currentCalendar.name ? "" : error.name}
                />
              </div>
            </div>
            <div className={styles.inputContainer}>
              <Icon name="Palette" className={styles.imgPalette} />
              {isFormVisible && (
                <div className={styles.labelInputContainer}>
                  <label htmlFor="">Colour</label>
                  <ColorPicker
                    type="button"
                    colors={colors}
                    onColorSelect={handleColorSelect}
                    pickedColor={currentCalendar.color}
                  />
                </div>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <Button
                primary
                label="Save"
                className={styles.buttonSave}
                type="submit"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
