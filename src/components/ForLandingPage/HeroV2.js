import React from "react";
import styles from "../../styles/LandingPageMain.module.css";

export default function HeroV2() {
  return (
    <div className={styles.heroWrapper}>
      <img className={styles.landing1} src="/landing1.png" alt="landing1" />
      <img className={styles.landing2} src="/landing2.png" alt="landing2" />
      <img className={styles.landing3} src="/landing3.png" alt="landing3" />
      <img className={styles.landing4} src="/landing4.png" alt="landing4" />
      <img className={styles.landing5} src="/landing5.png" alt="landing5" />

      <span className={styles.heroTextSpan}>
        W<span className={styles.heroPinkText}>ai</span>tlists that spark joy
      </span>
    </div>
  );
}
