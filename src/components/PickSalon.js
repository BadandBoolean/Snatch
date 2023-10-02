import React from "react";
import { useEffect, useState } from "react";
import { Select } from "antd/lib";
import styles from "../styles/salonselect.module.css";

export default function PickSalon({
  setShowingSalonId,
  isFilteringByDist,
  setIsFilteringByDist,
}) {
  const [salons, setSalons] = useState([]);
  const [salonsLoading, setSalonsLoading] = useState(true);

  useEffect(() => {
    fetch(`./api/getAllSalons`)
      .then((res) => res.json())
      .then((data) => {
        setSalons(data.salons);
        setSalonsLoading(false);
      });
  }, [setShowingSalonId, isFilteringByDist]);

  const options = salons.map((salon) => {
    return { value: salon.id, label: salon.name };
  });

  // add the 'all' option
  options.unshift({ value: "", label: "All salons" });

  const onSelectSalon = (value) => {
    // passes the id of the salon who's appointments to get.
    setIsFilteringByDist(false);
    setShowingSalonId(value);
  };

  return (
    <div className={styles.pickSalonDiv}>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Filter by salon"
        options={!salonsLoading && options}
        onChange={onSelectSalon}
        // set the default value to be "" if isfilteringbydist is true
        defaultValue={""}
      />
    </div>
  );
}
