import React from "react";
import styles from "../../styles/LandingPageMain.module.css";
import { Button } from "antd/lib";
import { ExperimentOutlined } from "@ant-design/icons";

export default function NavbarV2() {
  return (
    <div className={styles.NavbarOuterWrapper}>
      <div className={styles.NavbarStructure}>
        <div className={styles.NavbarLogoWrapper}>
          <span className={styles.NavbarLogoBox}>
            <i>Snatch</i>
          </span>
        </div>
        <div className={styles.NavbarButtonsWrapper}>
          <div className={styles.NavbarButtonBox}>
            <span className={styles.NavbarTextButton}>About</span>
            <span className={styles.NavbarTextButton}>Contact</span>
            <span className={styles.NavbarTextButton}>Pricing</span>
            <span className={styles.NavbarDemoButton}>
              <Button type="primary">
                <ExperimentOutlined />
                Demo
              </Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
