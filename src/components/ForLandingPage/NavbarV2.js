import React from "react";
import styles from "../../styles/LandingPageMain.module.css";
import { Button, Popover } from "antd/lib";
import { ExperimentOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export default function NavbarV2() {
  const router = useRouter();
  const scrollToSection = (sectionId) => {
    console.log(sectionId);
    const section = document.getElementById(sectionId);
    console.log(section);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onMarketPlaceClick = () => {
    router.push("/find-appointments");
  };

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
            <span
              onClick={onMarketPlaceClick}
              className={styles.NavbarTextButton}
            >
              Marketplace
            </span>
            <span
              className={styles.NavbarTextButton}
              onClick={() => scrollToSection("contact-section")}
            >
              Contact
            </span>
            <span
              className={styles.NavbarTextButton}
              onClick={() => scrollToSection("pricing-section")}
            >
              Pricing
            </span>
            <span className={styles.NavbarDemoButton}>
              <Popover content="Coming soon!">
                <Button type="primary">
                  <ExperimentOutlined />
                  Demo
                </Button>
              </Popover>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
