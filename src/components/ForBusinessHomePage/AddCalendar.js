import React, { useState, useEffect } from "react";
import styles from "../../styles/AddCalendar.module.css";
import { Input, Button, message } from "antd/lib";

export default function AddCalendar({ providerDetails }) {
  const [calendarUrl, setCalendarUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const updateCalVal = (e) => {
    setCalendarUrl(e.target.value);
  };

  const handleChangeCalendar = async () => {
    if (!calendarUrl) {
      message.error("Please enter a calendar URL");
      return;
    }
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    setSubmitting(true);
    const response = await fetch("./api/UpdateCalendarUrl", {
      method: "POST",
      body: JSON.stringify({
        calendarUrl: calendarUrl,
        providerId: providerDetails.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("Success");
      setTimeout(() => {
        messageApi.open({
          key,
          type: "success",
          content: "Calendar Link Updated!",
          duration: 3,
        });
      }, 1000);
    }
    console.log(response);
  };

  return (
    <div className={styles.calendarWrapper}>
      {contextHolder}
      {providerDetails?.hasRealSalon && (
        <div className={styles.contactOuterDivoh}>
          <div className={styles.contactMiddleDivoh}>
            <div className={styles.contactDivoh}>
              <span className={styles.callinktitletext}>
                Your Business Calendar Link:
              </span>

              <Input
                className={styles.inputFields}
                placeholder="Add your iCal link here"
                defaultValue={
                  providerDetails.calendarUrl
                    ? providerDetails.calendarUrl
                    : null
                }
                onChange={updateCalVal}
              />
              <Button
                className={styles.inputFields}
                type="primary"
                onClick={handleChangeCalendar}
              >
                Submit Change
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
