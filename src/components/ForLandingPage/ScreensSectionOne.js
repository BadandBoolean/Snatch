import React from "react";
import styles from "../../styles/LandingPageMain.module.css";

export default function ScreensSectionOne() {
  return (
    <div className={styles.screensSectionOneWrapper}>
      <div className={styles.screenshotWrapper}>
        <img
          className={styles.screenshot1}
          src="/littlescreen1.png"
          alt="screenshot1"
        />
        <img
          className={styles.screenshot2}
          src="/littlescreen2.png"
          alt="screenshot2"
        />
      </div>
      <div className={styles.textWrapper}>
        <span className={styles.text1}>Free up your frontdesk</span>
        <span className={styles.text2}>
          Notify your waitlist and get responses fast.
        </span>
      </div>
    </div>
  );
}
