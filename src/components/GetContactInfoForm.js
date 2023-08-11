import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  DatePicker,
  TimePicker,
} from "antd/lib";
import dayjs from "dayjs";
import styles from "../styles/ContactForm.module.css";

export default function GetContactInfoForm({
  addContactInfoForm,
  handleAddContactInfo,
}) {
  return (
    <>
      <div className={styles.contactWrapper}>
        <div className={styles.contactOuterDiv}>
          <div className={styles.contactMiddleDiv}>
            <div className={styles.contactDiv}>
              <h3 className={styles.infoText}>
                Get notified about last-minute appointments:
              </h3>

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
                  <Input placeholder="Enter your email address (optional)" />
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
                  <Input placeholder="Enter your phone number (optional)" />
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
