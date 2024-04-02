import React from "react";
import styles from "../styles/Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <p className={styles.footerText}>
            © 2024 Snatch <span style={{ color: "#02fefe" }}>(Beta)</span>
          </p>
        </div>
        <div className={styles.footerRight}>
          <p className={styles.footerText}>
            Made with ❤️ in Seattle |{" "}
            <Link
              style={{
                color: "white",
                textDecoration: "none",
                cursor: "pointer",
              }}
              href="mailto:team@wearesnatch.com"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
