import React from "react";
import styles from "../../styles/LandingPageMain.module.css";
import { LinkedinOutlined, InstagramOutlined } from "@ant-design/icons";
import Link from "next/link";
export default function Footer() {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.footerDiv}>
        <div className={styles.footerSloganBox}>
          <h1 className={styles.footerSlogan}>
            <i>Book somebody else&apos;s canceled appointment</i>
          </h1>
        </div>
        <div className={styles.footerInfoBox}>
          <div className={styles.footerLeft}>
            <span className={styles.copyrightInfo}>
              <b>Copyright © 2024 Snatch. All rights reserved.</b>
            </span>
          </div>
          <div className={styles.footerRight}>
            <span className={styles.footerOption}>
              <b>Privacy Policy</b>
            </span>
            <span className={styles.footerOption}>
              <b>Terms of Service</b>
            </span>
            <span className={styles.footerOption}>
              <b>Made with ❤️ in San Francisco</b>
            </span>
            <Link
              href="https://www.linkedin.com/company/getsnatch/"
              target="_blank"
            >
              <span className={styles.footerOption}>
                <LinkedinOutlined />
              </span>
            </Link>
            <Link href="https://www.instagram.com/waitly.ai/" target="_blank">
              <span className={styles.footerOption}>
                <InstagramOutlined />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
