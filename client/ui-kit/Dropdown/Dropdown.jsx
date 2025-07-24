import React, { useState } from "react";
import styles from "./Dropdown.module.css";
import { Icon } from "../Icon/Icon";
import classNames from "classnames";

export const Dropdown = ({
  defaultOption,
  icon,
  pressed,
  hovered,
  hoveredItem,
  options,
  className,
  onOptionChange,
}) => {
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const toggleDropdown = () => {
    setisDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setisDropdownOpen(false);
    if (onOptionChange) onOptionChange(option);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button
        className={classNames(styles.button, className, {
          [styles.pressed]: pressed,
          [styles.hovered]: hovered,
        })}
        onClick={toggleDropdown}
      >
        <h3>{selectedOption}</h3>
        <Icon name={icon} />
      </button>
      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <ul className={styles.dropdownList}>
            {options.map((option) => (
              <li
                key={option}
                className={classNames(styles.item, {
                  [styles.hoveredItem]: hoveredItem,
                  [styles.selected]: option === selectedOption,
                })}
                onClick={() => handleSelect(option)}
              >
                <h4>{option}</h4>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
