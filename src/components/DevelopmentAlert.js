import React from "react";
import { Alert } from "antd/lib";

export default function DevelopmentAlert() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Alert
        description="Thank you for visiting Snatch! We are currently testing our experience with a handful of partners and customers."
        type="error"
        closable
        style={{
          position: "fixed",
          top: "0",
          width: "90%",
          color: "rgba(255, 0, 0, 0.2)",
          color: "black",
          textAlign: "center",
          fontSize: "1rem",
        }}
      />
    </div>
  );
}
