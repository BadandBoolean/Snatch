import React from "react";
import { useState } from "react";
import { Table, Space, Button, Modal, Form } from "antd/lib";
import dayjs from "dayjs";
import styles from "../styles/tables.module.css";

export default function SalonBookingInfo({
  salon,
  salonInfoPublic,
  showBookingModal,
  bookingModalOpen,
  handleOkBookingModal,
}) {
  const [bookingModalData, setBookingModalData] = useState([]);

  const getSalonInfo = async () => {
    console.log(salon);
    const res = await fetch(`./api/getSalonFromName/${salon}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
    setBookingModalData(data);
    console.log(bookingModalData);
    showBookingModal();
  };

  const BookingModalText = () => {
    let hasPhone = bookingModalData.salon.bookingOptions.includes("Phone");
    let hasWebsite = bookingModalData.salon.bookingOptions.includes("website");
    let hasWalkIn = bookingModalData.salon.bookingOptions.includes("Walk-in");
    let hasAdditionalInfo = bookingModalData.salon.bookingInfo.length > 0;
    return (
      <>
        {hasPhone ? (
          <p>
            Call the salon at {bookingModalData.salon.phone} to book an
            appointment
          </p>
        ) : null}

        {hasWebsite ? (
          <p>
            Visit the salon&apos;s website at {bookingModalData.salon.address}{" "}
            to book an appointment
          </p>
        ) : null}

        {hasWalkIn ? <p>Walk into the salon to book an appointment</p> : null}

        {hasAdditionalInfo ? (
          <p>
            Additional Information for booking this appointment:
            {bookingModalData.salon.bookingInfo}
          </p>
        ) : null}
      </>
    );
  };

  return (
    <>
      <Button type="primary" onClick={getSalonInfo}>
        How to book an appointment at {salon}
      </Button>
      <Modal
        title={`How to book an appointment at ${salon}`}
        open={bookingModalOpen}
        onOk={handleOkBookingModal}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <BookingModalText />
      </Modal>
    </>
  );
}
