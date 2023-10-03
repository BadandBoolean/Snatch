import React from "react";
import styles from "../styles/PartnersPanel.module.css";

export default function PartnersPanel({}) {
  return (
    <div className={styles.divWrapper}>
      <div className={styles.innerDiv}>
        <div className={styles.textDiv}>
          <h3 className={styles.text}>Salons partnered with us:</h3>
        </div>
        <div className={styles.partnersOuterDiv}>
          <div className={styles.partnersDiv}>
            <a
              className={styles.logostyles}
              target="_blank"
              href="https://yvey.com/"
            >
              <img className={styles.logos} src="/yveylogo.png" />
            </a>
            <a
              className={styles.logostyles}
              target="_blank"
              href="https://www.salonmoony.com/"
            >
              <img className={styles.logos} src="/salonmoonylogo.png" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
