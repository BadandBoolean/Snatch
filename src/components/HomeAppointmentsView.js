import React from "react";
import { useState } from "react";
import { Table, Space, Button, Modal, Form } from "antd/lib";
import dayjs from "dayjs";
import styles from "../styles/tables.module.css";

// can in future filter by salon
// can also filter by day

export default function HomeAppointmentsView({
  appointments,
  salonDetails,
  bookingModalOpen,
  setBookingModalOpen,
  handleOkBookingModal,
}) {
  const [bookingModalData, setBookingModalData] = useState([]);

  const columns = [
    {
      title: "Salon",
      dataIndex: "salon",
      key: "salon",
      responsive: ["md"],
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      responsive: ["md"],
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => openBookingModal(record.key)}>
            Booking Information
          </Button>
        </Space>
      ),
    },
  ];

  const openBookingModal = async (apptId) => {
    const response = await fetch(`./api/getSalon/${apptId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const salonDetails = await response.json();
    setBookingModalData(salonDetails);
    console.log(salonDetails);
    setBookingModalOpen(true);
  };

  const dataSource = appointments.map((appointment) => {
    return {
      key: appointment.id,
      salon: appointment.salonname,
      date: dayjs(appointment.date).format("MM/DD/YYYY"),
      time: dayjs(appointment.time).format("HH:mm"),
      // show the notes in the modal instead
    };
  });

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
        <br />
        {hasWebsite ? (
          <p>
            Visit the salon`&apos;`s website at {bookingModalData.salon.address}{" "}
            to book an appointment
          </p>
        ) : null}
        <br />
        {hasWalkIn ? <p>Walk into the salon to book an appointment</p> : null}
        <br />
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
      <div style={{ width: "100%" }}>
        {dataSource.length > 0 ? (
          <Table
            columns={columns}
            dataSource={dataSource}
            size="small"
            className={styles.apptTable}
          />
        ) : (
          <p>
            There are no last minute appointments currently open! Come back
            later to see any changes
          </p>
        )}
      </div>
      <Modal
        title="How to book this appointment"
        open={bookingModalOpen}
        onOk={handleOkBookingModal}
        onCancel={handleOkBookingModal}
      >
        <BookingModalText />
      </Modal>
    </>
  );
}
