import React from "react";
import { Button, Dropdown } from "antd/lib";
import { DownOutlined } from "@ant-design/icons";
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

  const items = [
    {
      key: "1",
      label: (
        <Button
          className={styles.customButton}
          style={{ width: "100%" }}
          onClick={handleSignout}
        >
          Sign out
        </Button>
      ),
    },
  ];
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
            <Dropdown
              trigger={["click"]}
              menu={{
                items,
              }}
              dropdownRender={(menu) => <div>{menu}</div>}
              placement="bottomRight"
            >
              <button className={styles.customButton}>
                Welcome back! <DownOutlined />
              </button>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}

// TODO: randomise the output of the business login button!!!
