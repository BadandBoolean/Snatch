import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Segmented, Spin } from "antd/lib";

export default function ModeSwitch() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const changeHomeMode = (value) => {
    if (value === "clients") {
      setIsLoading(true);
      router.push("/");
      // switch off loading after a time delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else if (value === "business") {
      setIsLoading(true);
      router.push("/business");
      // switch off loading after a time delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const defaultVal = router.pathname === "/business" ? "business" : "clients";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "20px",
      }}
    >
      {" "}
      {isLoading ? (
        <Spin />
      ) : (
        <Segmented
          options={[
            { label: "Clients", value: "clients" },
            { label: "Businesses", value: "business" },
          ]}
          onChange={changeHomeMode}
          defaultValue={defaultVal}
        />
      )}
    </div>
  );
}
