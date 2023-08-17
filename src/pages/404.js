import React from "react";
import styles from "../styles/ErrorSignUp.module.css";
import Image from "next/image";

export default function Custom404() {
  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <div
          className={styles.unauthtext}
          style={{ fontWeight: "700", fontSize: "1.5em" }}
        >
          Oops! The page you are looking for does not exist!
        </div>
        <div className={styles.unauthimage}>
          <Image src="/errorimg2.png" alt="error500" width={300} height={300} />
        </div>
      </div>
    </div>
  );
}
