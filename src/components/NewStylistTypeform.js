import React, { useEffect } from "react";
import { Modal } from "antd/lib";

import Script from "next/script";

export default function NewStylistTypeform({
  newStylistModalOpen,
  handleCancelNewStylist,
  handleFinishTypeformAndRedirect,
  hiddenUserEmail,
}) {
  useEffect(() => {
    const handleTallyFormSubmit = (e) => {
      // check see what format the event.data is
      if (e.data && typeof e.data === "string") {
        if (e.data.includes("Tally.FormSubmitted")) {
          console.log("Tally form submitted");
          const payload = JSON.parse(e.data).payload;
          handleFinishTypeformAndRedirect(payload);
          //   // window.location.reload(); // Refresh the page - done in the parent
        }
      }
    };

    window.addEventListener("message", handleTallyFormSubmit);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("message", handleTallyFormSubmit);
    };
  }, [handleCancelNewStylist, handleFinishTypeformAndRedirect]);

  return (
    <Modal
      open={newStylistModalOpen}
      onCancel={handleCancelNewStylist}
      footer={null}
    >
      <iframe
        data-tally-src="https://tally.so/embed/3Nokvj?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        width="100%"
        height="284"
        title="Contact form"
      ></iframe>
      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          Tally.loadEmbeds();
        }}
      />
    </Modal>
  );
}
