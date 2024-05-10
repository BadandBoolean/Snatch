import React, { useState, useEffect } from "react";
import styles from "../styles/ServiceIcons.module.css";
import AppointmentCards from "./ForHomePage/AppointmentCards";
import ProviderCards from "./ForBusinessHomePage/ProviderCards";

export default function IconsGrid({ mode }) {
  const [serviceType, setServiceType] = useState("All");
  const [currVisibleAppts, setCurrVisibleAppts] = useState([]);
  const [apptsLoading, setApptsLoading] = useState(true);
  const [currVisibleProviders, setCurrVisibleProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  useEffect(() => {
    if (mode === "appointments") {
      console.log(serviceType);
      // fetch appointments by service type
      fetch(`./api/getApptsByServiceType/${serviceType}`)
        .then((res) => res.json())
        .then((data) => {
          setCurrVisibleAppts(data.appointments);
          setApptsLoading(false);
        });
    } else if (mode === "providers") {
      console.log(serviceType);
      // fetch providers by service type
      fetch(`./api/getProvidersByServiceType/${serviceType}`)
        .then((res) => res.json())
        .then((data) => {
          setCurrVisibleProviders(data.providers);
          setProvidersLoading(false);
        });
    }
  }, [serviceType]);

  useEffect(() => {
    console.log(currVisibleAppts);
  }, [currVisibleAppts]);

  useEffect(() => {
    console.log(currVisibleProviders);
  }, [currVisibleProviders]);

  const handleChangeServiceType = (e) => {
    setServiceType(e.currentTarget.value);
  };

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.sectionTitleWrapper}>
        <span className={styles.sectionTitle}>
          {mode === "appointments" && "✨ Appointments Available now ✨"}
          {mode === "providers" && (
            <span style={{ color: "white" }}>🌟 Explore Providers 🌟</span>
          )}
        </span>
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
      {mode === "appointments" && (
        <AppointmentCards
          apptsLoading={apptsLoading}
          currVisibleAppts={currVisibleAppts}
          serviceType={serviceType}
        />
      )}
      {mode === "providers" && (
        <ProviderCards
          providersLoading={providersLoading}
          currVisibleProviders={currVisibleProviders}
          serviceType={serviceType}
        />
      )}
    </div>
  );
}
