import React from "react";
import { Modal } from "antd/lib";
import { Widget } from "@typeform/embed-react";

export default function NewStylistTypeform({
  newStylistModalOpen,
  handleCancelNewStylist,
  handleFinishTypeformAndRedirect,
  hiddenUserEmail,
}) {
  return (
    <Modal
      open={newStylistModalOpen}
      onCancel={handleCancelNewStylist}
      footer={null}
    >
      <Widget
        id="Y5DM4C0s"
        className="typeform"
        style={{ width: "100%", height: "500px" }}
        onSubmit={handleFinishTypeformAndRedirect}
        hidden={{ useremail: hiddenUserEmail }}
      />
    </Modal>
  );
}
