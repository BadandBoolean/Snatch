import React, { useContext } from "react";
import styles from "../../styles/NavBar.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import { Dropdown } from "antd/lib";
import { DownOutlined } from "@ant-design/icons";
import { HomeModeContext } from "../../../lib/context";

import { Button } from "antd/lib";

export default function LoginBox() {
  const { homeMode, setHomeMode } = useContext(HomeModeContext);
  const { data: session, status } = useSession();

  const handleSignin = async () => {
    await signIn("google", { callbackUrl: "/business", redirect: false });
    setHomeMode("business");
  };
  const handleSignout = async () => {
    // e.preventDefault();
    await signOut();
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
  );
}
