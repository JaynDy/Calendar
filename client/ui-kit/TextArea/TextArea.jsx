import React from "react";
import styles from "./TextArea.module.css";

export const TextArea = ({
  description,
  value,
  onChange,
  name,
  placeholder,
  rows,
  cols,
}) => {
  return (
    <div className={styles.textAreaOverlay}>
      <div className={styles.textAreaContent}>
        <div className={styles.textAreaHeader}>
          <h6>{description}</h6>
        </div>
        <div className={styles.textAreaBody}>
          <textarea
            className={styles.textArea}
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            rows={rows}
            cols={cols}
          />
        </div>
      </div>
      <hr className={styles.textAreaHr} />
    </div>
  );
};
