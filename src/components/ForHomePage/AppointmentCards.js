// Returns all appointment cards for a selected service type to the home screen. child of ServiceIcons.js

import React from "react";
import { Card, Spin, Pagination } from "antd/lib";
import styles from "../../styles/ServiceIcons.module.css";
import isMobileDevice from "../../../lib/isMobileDevice";
import Link from "next/link";

import { useState } from "react";

export default function AppointmentCards({
  apptsLoading,
  currVisibleAppts,
  serviceType,
}) {
  // either direct to open a new page which is the salon booking page OR a phone: link to call and get the appointment
  const handleBookNow = async (appt) => {
    console.log("book now");
    console.log(appt);
    var isMobile = isMobileDevice();
    // get the phone number of the stylist or salon. if one doesn't exist, then get the booking website.
    const response = await fetch(
      `./api/getProviderFirstContact/${appt.salonId}`
    );
    const data = await response.json();
    console.log(data);
    let phone = data.phone;
    let website = data.address;

    if (isMobile && phone.length > 0) {
      window.open(`tel:${phone}`);
    } else if ((isMobile && website.length > 0) || website.length > 0) {
      if (
        !website.startsWith("http://") &&
        !website.startsWith("https://") &&
        !website.startsWith("tel:")
      ) {
        website = "https://" + website;
      }
      window.open(website, "_blank");
    } else if (!isMobile && phone.length > 0) {
      window.open(`tel:${phone}`);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Change as needed

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currVisibleAppts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (currVisibleAppts.length === 0) {
    return (
      <div className={styles.appointmentCardsWrapper}>
        <span style={{ textAlign: "center", margin: "3rem" }}>
          There are no last-minute openings available right now! Come back later
          or sign up for notifications below.
          <br />
          Want to see your local businesses list their appointments here?{" "}
          <Link
            style={{ color: "#4831D4", textDecoration: "none" }}
            href="team@wearesnatch.com"
          >
            Tell us about them!
          </Link>
        </span>
      </div>
    );
  }

  return (
    <div className={styles.appointmentCardsWrapper}>
      {apptsLoading ? (
        <Spin />
      ) : (
        currentItems.map((appt) => {
          // get appt.date which in UTC and extract to get the LOCALLY formatted date
          // get appt.time which in UTC and extract to get the LOCALLY formatted time
          let dateObject = new Date(appt.date);
          let date = dateObject.toLocaleDateString("en-US", {
            weekday: "long", // Name of the day
            year: "numeric", // Numeric year
            month: "long", // Full name of the month
            day: "numeric", // Numeric day of the month
          });
          let time = dateObject.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          return (
            <div key={appt.id} className={styles.appointmentCardDiv}>
              <Card
                size="small"
                key={appt.id}
                title={appt.salonname}
                style={{ width: 300 }}
                extra={<a onClick={() => handleBookNow(appt)}>Book Now</a>}
              >
                <p>{appt.servicetype}</p>
                <p>{date}</p>
                <p>{time}</p>
                <p>
                  {appt.location} {appt.zipcode}
                </p>
              </Card>
            </div>
          );
        })
      )}
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        total={currVisibleAppts.length}
        pageSize={itemsPerPage}
        showSizeChanger={true}
        onShowSizeChange={(current, size) => setItemsPerPage(size)}
      />
    </div>
  );
}
