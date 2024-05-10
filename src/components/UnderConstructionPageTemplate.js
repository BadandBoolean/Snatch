import React from "react";
import styles from "../styles/BusinessHomePage.module.css";
import ucstyles from "../styles/UnderConstruction.module.css";

export default function UnderConstructionPageTemplate() {
  return (
    <>
      {" "}
      <div className={styles.pageRow}>
        <div className={ucstyles.underconstructiontext}>
          <h1>Under Construction</h1>
        </div>
      </div>
      <div className={styles.pageRow}>
        <div className={ucstyles.underconstructiontext}>
          We are working on this page! Please check back later for updates.
        </div>
      </div>
      <div className={styles.pageRow}>
        <img
          className={ucstyles.underconstructionimg}
          src="/underconstruction.jpg"
          alt="business"
        />
      </div>
    </>
  );
}
