import React from "react";
import { useEffect, useState } from "react";
import { Select } from "antd/lib";
import styles from "../styles/salonselect.module.css";

export default function PickSalon({ setShowingSalonId }) {
  const [salons, setSalons] = useState([]);
  const [salonsLoading, setSalonsLoading] = useState(true);

  useEffect(() => {
    fetch(`./api/getAllSalons`)
      .then((res) => res.json())
      .then((data) => {
        setSalons(data.salons);
        setSalonsLoading(false);
      });
  }, []);

  const options = salons.map((salon) => {
    return { value: salon.id, label: salon.name };
  });

  // add the 'all' option
  options.unshift({ value: "", label: "All salons" });

  const onSelectSalon = (value) => {
    // passes the id of the salon who's appointments to get.
    setShowingSalonId(value);
  };

  return (
    <div className={styles.divWrapper}>
      <div className={styles.placementDiv}>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Filter by salon"
          options={!salonsLoading && options}
          onChange={onSelectSalon}
        />
      </div>
    </div>
  );
}
