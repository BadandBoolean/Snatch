import React from "react";
import { Modal } from "antd/lib";

import Script from 'next/script'
import Tally from 'tally-js'

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
      <iframe data-tally-src="https://tally.so/embed/3Nokvj?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" width="100%" height="284" frameBorder="0" marginHeight="0" marginWidth="0" title="Contact form"></iframe>
      <Script
                id="tally-js"
                src="https://tally.so/widgets/embed.js"
                onLoad={() => {
                    Tally.loadEmbeds();
                }}
                onSubmit={()}
            />
    </Modal>
  );
}
