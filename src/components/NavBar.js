import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  DatePicker,
  TimePicker,
} from "antd/lib";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/NavBar.module.css";
import Link from "next/link";

//In the navbar we want the title, Snatch, and then Business login button next to it.
export default function NavBar({}) {
  const { data: session, status } = useSession();

  const handleSignin = () => {
    // e.preventDefault();
    signIn();
  };
  const handleSignout = () => {
    // e.preventDefault();
    signOut();
  };
  return (
    <div className={styles.NavWrapper}>
      <div className={styles.Nav}>
        <div className={styles.NavTitleBox}>
          <h1 className={styles.Title}>
            <Link href="/" style={{ textDecoration: "none", color: "white" }}>
              <em>Snatch</em>
            </Link>
          </h1>
        </div>
        <div className={styles.NavLoginBox}>
          {status === "unauthenticated" && (
            <button className={styles.customButton} onClick={handleSignin}>
              Business Login
            </button>
          )}
          {status === "authenticated" && (
            <button className={styles.customButton} onClick={handleSignout}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
