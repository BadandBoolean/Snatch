import React from "react";
import { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd/lib";
import styles from "../styles/ContactForm.module.css";

export default function GetContactInfoForm({
  addContactInfoForm,
  handleAddContactInfo,
  contactFormTitle,
}) {
  const [salonsLoading, setSalonsLoading] = useState(true);
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    fetch(`./api/getAllSalons`)
      .then((res) => res.json())
      .then((data) => {
        setSalons(data.salons);
        setSalonsLoading(false);
      });
  }, []);

  const options = salons.map((salon) => {
    return { value: salon.id, label: salon.name };
  });
  options.unshift({ value: "", label: "All salons" });

  return (
    <>
      <div className={styles.contactWrapper}>
        <div className={styles.contactOuterDiv}>
          <div className={styles.contactMiddleDiv}>
            <div className={styles.contactDiv}>
              <h3 className={styles.infoText}>{contactFormTitle}</h3>

              <Form
                form={addContactInfoForm}
                onFinish={handleAddContactInfo}
                className={styles.contactForm}
              >
                <Form.Item
                  label={
                    <p
                      style={{
                        fontSize: "16px",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      Email
                    </p>
                  }
                  name="emailaddress"
                >
                  <Input
                    placeholder="Enter your email address (optional)"
                    maxLength={50}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <p
                      style={{
                        fontSize: "16px",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      Phone Number
                    </p>
                  }
                  name="phonenumber"
                >
                  <Input
                    placeholder="Enter your phone number (optional)"
                    maxLength={15}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <p
                      style={{
                        fontSize: "16px",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      Select a salon
                    </p>
                  }
                  name="salonselect"
                >
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Filter by salon"
                    defaultValue={""}
                    options={!salonsLoading && options}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{
                      backgroundColor: "rgba(102, 79, 253, 0.8)",
                      color: "white",
                      border: "2px solid white",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    htmlType="submit"
                  >
                    <b>Submit</b>
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
