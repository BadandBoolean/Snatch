import React from "react";
import styles from "../../styles/LandingPageMain.module.css";
import { StarFilled } from "@ant-design/icons";

export default function ScreensSectionTwo() {
  return (
    <div className={styles.screensSectionTwoWrapper}>
      <div className={styles.screensSectionTwoTextWrapper}>
        <span className={styles.textHeader}>
          Friendly, contextual, informative messaging. Unique and personable.{" "}
          <b>Every time.</b>
        </span>

        <div className={styles.textBullets}>
          <div className={styles.textBulletsTitles}>
            <StarFilled /> <b>No Spam. Ever.</b>
          </div>
          <br />
          Clients receive only a few texts a month. Auto-removed from waitlist
          if they book/get multiple texts. Customisable alert frequency.
          <br />
          <br />
          <br />
          <div className={styles.textBulletsTitles}>
            <StarFilled /> <b>Interactive Texts</b>
          </div>
          <br />
          AI assistant alerts you when a client is interested in booking an
          appointment. Responds to client if the slot has been filled.
        </div>
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
