import React from "react";
import styles from "../../styles/ErrorSignUp.module.css";
import Image from "next/image";
import Link from "next/link";

export default function unauthorizedsignup() {
  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <div
          className={styles.unauthtext}
          style={{ fontWeight: "700", fontSize: "1.5em" }}
        >
          Oops! Looks like you can&apos;t log in as a partner just yet!
        </div>
        <div className={styles.unauthimage}>
          <Image
            src="/unauthlogin.png"
            alt="loginunauthorized"
            width={300}
            height={300}
          />
        </div>
        <div className={styles.unauthtext}>
          Click{" "}
          <Link style={{ textDecoration: "none" }} href="/">
            here
          </Link>{" "}
          to go back to the home page. <br />
          <Link
            style={{ textDecoration: "none" }}
            href="mailto:aliya.ismagilova99@gmail.com"
          >
            Contact the developers
          </Link>{" "}
          if you believe this is an error.
        </div>
      </div>
    </div>
  );
}
