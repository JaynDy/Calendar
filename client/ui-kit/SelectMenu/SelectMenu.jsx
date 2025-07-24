import React, { useState, useEffect, useRef } from "react";
import styles from "./SelectMenu.module.css";
import classNames from "classnames";
import { Icon } from "../Icon";

export const SelectMenu = ({
  label,
  selectedOption,
  id,
  icon,
  hoveredItem,
  selectedItem,
  options,
  onOptionSelect,
  className,
  readOnly,
  error,
}) => {
  // console.log("SelectMenu options:", options);
  // console.log("SelectMenu selectedOption:", selectedOption);

  const [isSelectMenuOpen, setIsSelectMenuOpen] = useState(false);
  const selectedTimeRef = useRef(null);
  const timeListRef = useRef(null);

  const toggleSelectMenu = () => {
    if (onOptionSelect) {
      onOptionSelect();
    }
    setIsSelectMenuOpen(!isSelectMenuOpen);
  };

  const handleSelectMenu = (option) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    }
    setIsSelectMenuOpen(false);
  };

  useEffect(() => {
    const divs = document.querySelectorAll(`.${styles.selectMenuHr}`);
    if (divs.length > 0) {
      divs[0].classList.add(styles.firstSelectMenuHr);
      if (divs[1]) {
        divs[1].classList.add(styles.secondSelectMenuHr);
      }
      if (divs[2]) {
        divs[2].classList.add(styles.secondSelectMenuHr);
      }
    }
  }, [isSelectMenuOpen, selectedOption]);

  useEffect(() => {
    if (selectedTimeRef.current) {
      selectedTimeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedOption]);

  return (
    <div
      className={styles.selectMenuContainer}
      key={selectedOption?.id || "default"}
    >
      <label htmlFor={id}>{label}</label>
      <button
        type="button"
        id={id}
        className={classNames(styles.buttonSelectMenu, {
          [styles.error]: error,
        })}
        onClick={toggleSelectMenu}
      >
        {selectedOption && typeof selectedOption === "object" ? (
          <div className={styles.calendarContainer}>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: selectedOption.color }}
            ></div>
            {selectedOption.name}
          </div>
        ) : (
          selectedOption
        )}
        <Icon name={icon} className={className} />
      </button>
      <div
        className={classNames(styles.selectMenuHr, {
          [styles.readOnly]: readOnly,
          [styles.menuError]: error,
        })}
      />

      {isSelectMenuOpen && (
        <ul className={styles.wrapperMenu} ref={timeListRef}>
          {options.map((option) => {
            const isCalendarOption = option.color && option.name;

            return (
              <li
                key={option.id || option}
                className={classNames({
                  [styles.hoveredItem]: hoveredItem,
                  [styles.selectedItem]:
                    selectedItem && selectedOption?.id === option.id,
                })}
                onClick={() => handleSelectMenu(option)}
                ref={option.id === selectedOption?.id ? selectedTimeRef : null}
              >
                {isCalendarOption ? (
                  <div className={styles.calendarContainer}>
                    <div
                      className={styles.colorBox}
                      style={{ backgroundColor: option.color }}
                    ></div>
                    {option.name}
                  </div>
                ) : (
                  option
                )}
              </li>
            );
          })}
        </ul>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
