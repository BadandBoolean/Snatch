import React from "react";
import styles from "../styles/Hero.module.css";
import { ArrowDownOutlined } from "@ant-design/icons";

export default function Hero() {
  return (
    <>
      <div className={styles.heroDivWrapper}>
        <div className={styles.heroDiv}>
          <h1 className={styles.heroText}>
            <i>Book somebody else&apos;s canceled appointment</i>
          </h1>
        </div>
      </div>
      <div className={styles.arrowDiv}>
        <ArrowDownOutlined className={styles.arrowStyle} />
      </div>
    </>
  );
}
