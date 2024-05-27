import React from "react";
import styles from "../styles/LandingPageMain.module.css";
import NavbarV2 from "../components/ForLandingPage/NavbarV2";
import HeroV2 from "../components/ForLandingPage/HeroV2";
import ScreensSectionOne from "../components/ForLandingPage/ScreensSectionOne";
import ScreensSectionTwo from "../components/ForLandingPage/ScreensSectionTwo";

export default function Home() {
  return (
    <div className={styles.page}>
      <NavbarV2 />
      <HeroV2 />
      <ScreensSectionOne />
      <ScreensSectionTwo />
    </div>
  );
}
