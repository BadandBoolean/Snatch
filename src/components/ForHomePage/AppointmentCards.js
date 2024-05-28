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
  // BUG: prisma thinks that timestamp is in UTC even though it is actually in the local time already in the database.
  // as a work around for now we are not going to convert the time to local time, as it is already in local time.
  return (
    <div className={styles.appointmentCardsWrapper}>
      {apptsLoading ? (
        <Spin />
      ) : (
        currentItems.map((appt) => {
          // temp bug fix: remove the z at the end of the date string
          let localDate = appt.date.slice(0, -1);
          let dateObject = new Date(localDate);
          let date = dateObject.toLocaleTimeString("en-US", {
            weekday: "long", // Name of the day
            year: "numeric", // Numeric year
            month: "long", // Full name of the month
            day: "numeric", // Numeric day of the month
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
