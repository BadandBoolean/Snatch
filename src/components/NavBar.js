import React, { useContext } from "react";
import { Button } from "antd/lib";
import { DownOutlined } from "@ant-design/icons";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import ModeSwitch from "./ModeSwitch";
import { HomeModeContext } from "../../lib/context";

//In the navbar we want the title, Snatch, and then Business login button next to it.
export default function NavBar() {
  const { homeMode, setHomeMode } = useContext(HomeModeContext);
  const { data: session, status } = useSession();

  return (
    <div className={styles.NavWrapper}>
      <div className={styles.Nav}>
        <div className={styles.NavTitleBox}>
          <h1 className={styles.Title}>
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
          </h1>
        </div>
      </div>
      <div className={styles.NavModeSelectWrapper}>
        <div className={styles.NavModeSelect}>
          <ModeSwitch setHomeMode={setHomeMode} />
        </div>
      </div>
    </div>
  );
}
