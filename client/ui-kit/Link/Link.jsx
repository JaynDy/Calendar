import React from "react";
import styles from "./Link.module.css";
import classNames from "classnames";

export const Link = ({ href, target, children, className }) => {
  return (
    <a
      href={href}
      target={target}
      className={classNames(styles.link, className)}
    >
      {children}
    </a>
  );
};
