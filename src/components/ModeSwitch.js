import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Segmented } from "antd/lib";

export default function ModeSwitch() {
  const router = useRouter();

  const changeHomeMode = (value) => {
    if (value === "clients") {
      router.push("/");
    } else if (value === "business") {
      router.push("/business");
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
      <Segmented
        options={[
          { label: "Clients", value: "clients" },
          { label: "Business", value: "business" },
        ]}
        onChange={changeHomeMode}
        defaultValue={defaultVal}
      />
    </div>
  );
}
