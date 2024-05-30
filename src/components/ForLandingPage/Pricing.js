import React from "react";
import styles from "../../styles/LandingPageMain.module.css";

export default function Pricing({ id }) {
  return (
    <div id={id} className={styles.pricingWrapper}>
      <div className={styles.pricingTitleWrapper}>
        <h1 className={styles.pricingTitle}>Pricing</h1>
      </div>
      <div className={styles.pricingCardsWrapper}>
        <div className={styles.pricingCardA}>
          <div className={styles.pricingCardContentWrapper}>
            <div className={styles.pricingCardTitle}>
              <b>Pay as you go</b>
            </div>
            <div className={styles.pricingCardText}>
              Help us keep the lights on. Pay a small amount per message sent
              per client, billed monthly.
              <br />
              <b>First 100 messages free.</b>
            </div>
            <div className={styles.pricingButtonWrapper}>
              <button className={styles.pricingButtonA}>
                <b>Coming Soon</b>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.pricingCardB}>
          <div className={styles.pricingCardContentWrapper}>
            <div className={styles.pricingCardTitleB}>
              <b>Fixed monthly subscription</b>
            </div>
            <div className={styles.pricingCardTextB}>
              Pay a fixed amount per month for unlimited messages.
              <br />
              <b>First month 50% off.</b>
            </div>
            <div className={styles.pricingButtonWrapper}>
              <button className={styles.pricingButtonB}>
                <b>Coming Soon</b>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.pricingCardA}>
          <div className={styles.pricingCardContentWrapper}>
            <div className={styles.pricingCardTitle}>
              <b>Enterprise plans available</b>
            </div>
            <div className={styles.pricingCardText}>
              Every business has different needs. Tell us about yours
            </div>
            <div className={styles.pricingButtonWrapper}>
              <button className={styles.pricingButtonA}>
                <b>Coming Soon</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
