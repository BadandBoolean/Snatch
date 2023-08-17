import React from "react";
import styles from "../styles/ErrorSignUp.module.css";
import Image from "next/image";

export default function Custom500() {
  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <div
          className={styles.unauthtext}
          style={{ fontWeight: "700", fontSize: "1.5em" }}
        >
          An unknown error has occured! We are working on it...
        </div>
        <div className={styles.unauthimage}>
          <Image src="/errorimg1.png" alt="error500" width={300} height={300} />
        </div>
      </div>
    </div>
  );
}
