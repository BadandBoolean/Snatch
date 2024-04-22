// a component which will be triggered by an about button to be scrolled to, and will show how to use the app for businesses and customers

import React from "react";
import { Tabs } from "antd/lib";
import styles from "../styles/About.module.css";
import Link from "next/link";

export default function About({}) {
  return (
    <div className={styles.divWrapper}>
      <div className={styles.innerDiv}>
        <div className={styles.picturesDiv}>
          <div className={styles.pic1Div}>
            <div className={styles.ssinnerdiv}>
              <img className={styles.screenshotDiv} src="/aitext.png" />
            </div>
          </div>

          <svg
            styles={{ position: "absolute", zIndex: "0" }}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#2D19B1"
              d="M37.4,-50.6C48.1,-43.7,56.2,-32.3,59.9,-19.8C63.5,-7.3,62.6,6.4,59.9,21C57.2,35.5,52.8,51,42.5,58C32.2,64.9,16.1,63.3,0.3,62.9C-15.5,62.4,-30.9,63.1,-41.2,56.2C-51.5,49.2,-56.6,34.6,-60.7,20.1C-64.8,5.6,-68,-8.8,-60.7,-16.1C-53.3,-23.4,-35.4,-23.7,-23.5,-30.3C-11.6,-36.9,-5.8,-49.7,3.8,-54.9C13.3,-60.1,26.7,-57.6,37.4,-50.6Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className={styles.tabsDiv}>
          <h1 className={styles.aboutText}>Get on the list</h1>
          <p className={styles.aboutTextPara}>
            <i>AI-Powered Notifications for Last-Minute Opportunities✨</i>
          </p>
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab="For Clients" key="1">
              <div className={styles.aboutTextParaTab}>
                Your go-to stylist or tattoist or massage therapist is fully
                booked? Their next available appointment is in 3 MONTHS? We hear
                you.
                <br /> - <br />
                Sign up to get texted immediately when your favorite spot gets a
                last-minute opening you need. {`\n`}
                <br /> - <br />
                Know a business that needs Snatch? Tell us about them:
                <Link
                  className={styles.link}
                  href="mailto:team@wearesnatch.com"
                >
                  team@wearesnatch.com
                </Link>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="For Businesses" key="2">
              <div className={styles.aboutTextParaTab}>
                Attention appointment-based business owners!
                <br /> - <br />
                Fill your last-minute cancellations. Fast. Reach hundreds of
                loyal clients (and new ones!) immediately whenever you have a
                cancellation. Goodbye waitlists forever. {`\n`}
                <br /> - <br />
                Ready to get started? Send us an email!
                <Link
                  className={styles.link}
                  href="mailto:team@wearesnatch.com"
                >
                  team@wearesnatch.com
                </Link>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
