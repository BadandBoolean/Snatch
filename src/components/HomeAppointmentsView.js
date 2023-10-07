import React from "react";
import { useState, useEffect } from "react";
import { Table, Space, Button, Modal, Form } from "antd/lib";
import dayjs from "dayjs";
import styles from "../styles/tables.module.css";
import { useLogger } from "next-axiom";
import Link from "next/link";

// can in future filter by salon
// can also filter by day
// need to do the dollar sign before price but need to escape it in the <p> like this:
// <p>
//   <b>Price: </b>
//   ${price}
// </p>

export default function HomeAppointmentsView({
  infoModalOpen,
  setInfoModalOpen,
  handleOkInfoModal,
  salonId,
  isFilteringByDist,
  userZip,
  searchRadius,
}) {
  const logger = useLogger();
  const [infoModalData, setInfoModalData] = useState({});
  const [bookingData, setBookingData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isApptsLoading, setApptsLoading] = useState(true);

  useEffect(() => {
    console.log("salonId", salonId);
    console.log("isFilteringByDist", isFilteringByDist);
    if (!isFilteringByDist) {
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
    } else {
      // we are filtering by distance so we have to get all appointments and then get their distance wrt to the inputed distance of the user.
      // then we have to filter out the ones that are too far away.
      // then we have to sort them by distance.
      // then we have to set the appointments to the sorted list.
      fetch(`./api/findApptsInRad`, {
        method: "POST",
        body: JSON.stringify({
          userZip: userZip,
          searchRadius: searchRadius,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          logger.info("Appointments filtered by distance", {
            appointments: data.filteredAppointments,
          }); // change, too much
          setAppointments(data.filteredAppointments);
          setApptsLoading(false);
        });
    }
  }, [salonId, isFilteringByDist, userZip, searchRadius]);

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
      title: "Booking Phone",
      dataIndex: "bookingPhone",
      key: "bookingPhone",
      hidden: true,
    },
    {
      title: "Booking Link",
      dataIndex: "bookingLink",
      key: "bookingLink",
      hidden: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      hidden: true,
    },
    {
      title: "Zipcode",
      dataIndex: "zipcode",
      key: "zipcode",
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
    // we don't necessarily now have a salon attached to the salon id!
    // record.key is the appointment id not the salon id.
    const response = await fetch(`./api/getApptDetails/${record.key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const salonDetails = await response.json();
    // if the salonDetails object is empty, then we have to get the salon details from the appointment itself
    console.log("HERE ARE THE SALON DETAILS");
    console.log(salonDetails);
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
      time: dayjs(appointment.time).format("hh:mm a"),
      whoWith: appointment.whoWith,
      service: appointment.service,
      price: appointment.price,
      notes: appointment.notes,
      bookingPhone: appointment.bookingPhone,
      bookingLink: appointment.bookingLink,
      location: appointment.location,
      zipcode: appointment.zipcode,
    };
  });

  const InfoModalText = () => {
    // console.log(infoModalData);
    let notes = infoModalData.notes;
    let whoWith = infoModalData.whoWith;
    let service = infoModalData.service;
    let price = infoModalData.price;
    // check if bookingData has any value.
    if (Object.keys(bookingData).length === 0) {
      // make an address out of the location and zipcode
      let loc = infoModalData.location + " " + infoModalData.zipcode;
      let bookingPhone = infoModalData.bookingPhone;
      let bookingLink = infoModalData.bookingLink;

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
            <b>Price: </b>${price}
          </p>
          <p>
            <b>Additional Notes from the Salon: </b>
            {notes}
          </p>
          <p>
            <b>Salon Location: </b>
            <a
              target="_blank"
              rel="noopener"
              href={`https://www.google.com/maps/search/?api=1&query=${loc}`}
            >
              {loc}
            </a>
          </p>
          <hr />
          <p style={{ fontSize: "1rem" }}>
            <b>
              {"\uD83D\uDCC6 \u26A0\uFE0F"} How to book this appointment:{" "}
              {"\u26A0\uFE0F \uD83D\uDCC6"}
            </b>
          </p>
          <p>
            Call the salon to book: {bookingPhone}
            <br />
            Book this appointment online:{" "}
            <a target="_blank" rel="noopener" href={bookingLink}>
              {bookingLink}
            </a>
          </p>
        </>
      );
    } else {
      let hasPhone = bookingData.salon.bookingOptions.includes("Phone");
      let hasWebsite = bookingData.salon.bookingOptions.includes("website");
      let hasWalkIn = bookingData.salon.bookingOptions.includes("Walk-in");
      let hasAdditionalInfo = bookingData.salon.bookingInfo.length > 0;
      // make a clickable link of out the website
      let website;
      hasWebsite
        ? (website = "https://" + bookingData.salon.address)
        : (website = "");

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
            <b>Price: </b>${price}
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
              Call the salon at {bookingData.salon.phone} to book an
              appointment.
            </p>
          ) : null}

          {hasWebsite ? (
            <p>
              Visit{" "}
              <Link target="_blank" rel="noopener" href={website}>
                {bookingData.salon.address}
              </Link>{" "}
              to book this appointment
            </p>
          ) : null}

          {hasWalkIn ? (
            <p>Walk in to the salon to book an appointment</p>
          ) : null}

          {hasAdditionalInfo ? <p>{bookingData.salon.bookingInfo}</p> : null}
        </>
      );
    }
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
                {!isFilteringByDist ? (
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
                ) : (
                  <span style={{ textAlign: "center" }}>
                    Looks like we are a little far away from you! 🌎 <br />
                    Want Snatch to come to your city? 🌆{" "}
                    <Link
                      style={{ color: "#4831D4", textDecoration: "none" }}
                      href="team@wearesnatch.com"
                    >
                      Reach out to us!
                    </Link>
                  </span>
                )}
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
