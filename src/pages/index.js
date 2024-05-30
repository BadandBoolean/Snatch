import React from "react";
import styles from "../styles/LandingPageMain.module.css";
import NavbarV2 from "../components/ForLandingPage/NavbarV2";
import HeroV2 from "../components/ForLandingPage/HeroV2";
import ScreensSectionOne from "../components/ForLandingPage/ScreensSectionOne";
import ScreensSectionTwo from "../components/ForLandingPage/ScreensSectionTwo";
import ContactUs from "../components/ForLandingPage/ContactUs";
import Pricing from "../components/ForLandingPage/Pricing";
import Footer from "../components/ForLandingPage/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <NavbarV2 />
      <HeroV2 />
      <ScreensSectionOne />
      <ScreensSectionTwo />
      <ContactUs id="contact-section" />
      <Pricing id="pricing-section" />
      <Footer />
    </div>
  );
}
