import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd/lib";
import { DownOutlined } from "@ant-design/icons";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import ModeSwitch from "./ModeSwitch";
import { useRouter } from "next/router";

//In the navbar we want the title, Snatch, and then Business login button next to it.
export default function NavBar() {
  const { data: session, status } = useSession();
  const [showModeSwitch, setShowModeSwitch] = useState(true);

  // only show ModeSwitch if we are NOT on the OwnerHome page
  const router = useRouter();
  useEffect(() => {
    if (router.pathname === "/OwnerHome") {
      setShowModeSwitch(false);
    } else {
      setShowModeSwitch(true);
    }
  }, [router.pathname]);

  return (
    <div className={styles.NavWrapper}>
      <div className={styles.Nav}>
        <div className={styles.NavTitleBox}>
          <span className={styles.Title}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "white",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <em>Snatch</em>
            </Link>
          </span>
        </div>
      </div>
      <div className={styles.NavModeSelectWrapper}>
        <div className={styles.NavModeSelect}>
          {showModeSwitch && <ModeSwitch />}
        </div>
      </div>
    </div>
  );
}
