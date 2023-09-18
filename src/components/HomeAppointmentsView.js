import React from "react";
import { useState, useEffect } from "react";
import { Table, Space, Button, Modal, Form } from "antd/lib";
import dayjs from "dayjs";
import styles from "../styles/tables.module.css";
import { useLogger } from "next-axiom";
import Link from "next/link";

// can in future filter by salon
// can also filter by day

export default function HomeAppointmentsView({
  infoModalOpen,
  setInfoModalOpen,
  handleOkInfoModal,
  salonId,
}) {
  const logger = useLogger();
  const [infoModalData, setInfoModalData] = useState({});
  const [bookingData, setBookingData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isApptsLoading, setApptsLoading] = useState(true);

  useEffect(() => {
    if (!salonId) {
      // get all appointments, regardless of salon.
      fetch(`./api/getAllAppts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAppointments(data.appointments);
          setApptsLoading(false);
        });
    } else {
      fetch(`./api/getApptsBySalon/${salonId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAppointments(data.appointments);
          setApptsLoading(false);
        });
    }
  }, [salonId]);

  const columns = [
    {
      title: "Salon",
      dataIndex: "salon",
      key: "salon",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "With",
      dataIndex: "whoWith",
      key: "whoWith",
      hidden: true,
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      hidden: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      hidden: true,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      hidden: true,
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => openInfoModal(record)}>Details</Button>
        </Space>
      ),
    },
  ];
  // we need to put 4 appointment data points into the booking modal instead.

  const openInfoModal = async (record) => {
    // console.log(record);
    const response = await fetch(`./api/getSalon/${record.key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const salonDetails = await response.json();
    // console.log(salonDetails);
    setBookingData(salonDetails);
    setInfoModalData(record);
    setInfoModalOpen(true);
  };
  // if (appointments) {
  //   console.log("HERE ARE THE APPOINTMENTS");
  //   console.log(appointments);
  //   const dataSource = appointments.map((appointment) => {
  //     return {
  //       key: appointment.id,
  //       salon: appointment.salonname,
  //       date: dayjs(appointment.date).format("MM/DD/YYYY"),
  //       time: dayjs(appointment.time).format("HH:mm"),
  //       whoWith: appointment.whoWith,
  //       service: appointment.service,
  //       price: appointment.price,
  //       notes: appointment.notes,
  //     };
  //   });
  // } else {
  //   console.log("no appointments...yet");
  //   const dataSource = [];
  // }
  const dataSource = appointments.map((appointment) => {
    return {
      key: appointment.id,
      salon: appointment.salonname,
      date: dayjs(appointment.date).format("MM/DD/YYYY"),
      time: dayjs(appointment.time).format("HH:mm"),
      whoWith: appointment.whoWith,
      service: appointment.service,
      price: appointment.price,
      notes: appointment.notes,
    };
  });

  const InfoModalText = () => {
    // console.log(infoModalData);
    let notes = infoModalData.notes;
    let whoWith = infoModalData.whoWith;
    let service = infoModalData.service;
    let price = infoModalData.price;
    let hasPhone = bookingData.salon.bookingOptions.includes("Phone");
    let hasWebsite = bookingData.salon.bookingOptions.includes("website");
    let hasWalkIn = bookingData.salon.bookingOptions.includes("Walk-in");
    let hasAdditionalInfo = bookingData.salon.bookingInfo.length > 0;
    return (
      <>
        <p>
          <b>Stylist: </b>
          {whoWith}
        </p>
        <p>
          <b>Available Services: </b>
          {service}
        </p>
        <p>
          <b>Price: </b>
          {price}
        </p>
        <p>
          <b>Additional Notes from the Salon: </b>
          {notes}
        </p>
        <hr />
        <p style={{ fontSize: "1rem" }}>
          <b>
            {"\uD83D\uDCC6 \u26A0\uFE0F"} How to book this appointment:{" "}
            {"\u26A0\uFE0F \uD83D\uDCC6"}
          </b>
        </p>
        {hasPhone ? (
          <p>
            Call the salon at {bookingData.salon.phone} to book an appointment.
          </p>
        ) : null}

        {hasWebsite ? (
          <p>Visit {bookingData.salon.address} to book an appointment</p>
        ) : null}

        {hasWalkIn ? <p>Walk in to the salon to book an appointment</p> : null}

        {hasAdditionalInfo ? (
          <p>
            Additional Information for booking this appointment:
            {bookingData.salon.bookingInfo}
          </p>
        ) : null}
      </>
    );
  };

  return (
    <>
      {!isApptsLoading ? (
        <div className={styles.appTable}>
          {dataSource.length > 0 ? (
            <Table
              columns={columns.filter((item) => !item.hidden)}
              dataSource={dataSource}
              size="small"
              className={styles.apptTable}
            />
          ) : (
            <div className={styles.noApptsWrapper}>
              <div className={styles.noApptsDiv}>
                <span style={{ textAlign: "center" }}>
                  There are no last-minute openings available right now! Come
                  back later or sign up for notifications below.
                  <br />
                  Want to see your local salons list their appointments here?{" "}
                  <Link
                    style={{ color: "#4831D4", textDecoration: "none" }}
                    href="team@wearesnatch.com"
                  >
                    Tell us about them!
                  </Link>
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
      <Modal
        title="Information about this appointment"
        open={infoModalOpen}
        onOk={handleOkInfoModal}
        onCancel={handleOkInfoModal}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <InfoModalText />
      </Modal>
    </>
  );
}
