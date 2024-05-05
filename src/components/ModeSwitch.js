import React, { useState } from "react";
import { useRouter } from "next/router";
import { Segmented } from "antd/lib";

export default function ModeSwitch({ setHomeMode }) {
  const router = useRouter();

  const changeHomeMode = (value) => {
    console.log("value", value);
    setHomeMode(value);
  };

  // what the default mode is depends on what page we're on aka what the router say
  const whichMode = router.pathname === "/business" ? "business" : "clients";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "40px",
      }}
    >
      <Segmented
        options={[
          { label: "Clients", value: "clients" },
          { label: "Business", value: "business" },
        ]}
        onChange={changeHomeMode}
        defaultValue={whichMode}
      />
    </div>
  );
}
