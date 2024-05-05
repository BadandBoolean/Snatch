import React, { useState, useEffect } from "react";
import styles from "../../styles/ServiceIcons.module.css";
import AppointmentCards from "./AppointmentCards";

export default function ServiceIcons({
  isFilteringByDist,
  userZip,
  searchRadius,
}) {
  const [serviceType, setServiceType] = useState("All");
  const [currVisibleAppts, setCurrVisibleAppts] = useState([]);
  const [apptsLoading, setApptsLoading] = useState(true);

  useEffect(() => {
    console.log(serviceType);

    // fetch appointments by service type
    fetch(`./api/getApptsByServiceType/${serviceType}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrVisibleAppts(data.appointments);
        setApptsLoading(false);
      });
  }, [serviceType]);

  useEffect(() => {
    console.log(currVisibleAppts);
  }, [currVisibleAppts]);

  const handleChangeServiceType = (e) => {
    setServiceType(e.currentTarget.value);
  };

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.sectionTitleWrapper}>
        <span className={styles.sectionTitle}>Find Appointments by Type</span>
      </div>
      <div className={styles.sectionIconsWrapper}>
        <button
          className={
            serviceType === "All" ? styles.activeIconPill : styles.iconPill
          }
          onClick={handleChangeServiceType}
          value="All"
        >
          <span
            className={
              serviceType === "All" ? styles.activePillText : styles.pillText
            }
          >
            All
          </span>
        </button>
        <button
          className={
            serviceType === "Hair" ? styles.activeIconPill : styles.iconPill
          }
          onClick={handleChangeServiceType}
          value="Hair"
        >
          <span
            className={
              serviceType === "Hair" ? styles.activePillText : styles.pillText
            }
          >
            Hair
          </span>
        </button>
        <button
          className={
            serviceType === "Nails" ? styles.activeIconPill : styles.iconPill
          }
          onClick={handleChangeServiceType}
          value="Nails"
        >
          <span
            className={
              serviceType === "Nails" ? styles.activePillText : styles.pillText
            }
          >
            Nails
          </span>
        </button>
        <button
          className={
            serviceType === "Tattoo" ? styles.activeIconPill : styles.iconPill
          }
          onClick={handleChangeServiceType}
          value="Tattoo"
        >
          <span
            className={
              serviceType === "Tattoo" ? styles.activePillText : styles.pillText
            }
          >
            Tattoo
          </span>
        </button>
      </div>
      <AppointmentCards
        apptsLoading={apptsLoading}
        currVisibleAppts={currVisibleAppts}
        serviceType={serviceType}
      />
    </div>
  );
}
