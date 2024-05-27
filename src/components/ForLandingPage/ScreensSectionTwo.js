import React from "react";
import styles from "../../styles/LandingPageMain.module.css";

export default function ScreensSectionTwo() {
  return (
    <div className={styles.screensSectionTwoWrapper}>
      <div className={styles.screensSectionTwoTextWrapper}>
        <span className={styles.textHeader}>
          Friendly, contextual, informative messaging. Unique and personable.{" "}
          <b>Every time.</b>
        </span>
        <span className={styles.textBullets}></span>
      </div>
      <div className={styles.screensSectionTwoImageWrapper}>
        <img
          className={styles.screensSectionTwoImage}
          src="/handscreen.png"
          alt="handscreen"
        />
      </div>
    </div>
  );
}
