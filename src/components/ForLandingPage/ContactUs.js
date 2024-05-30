import React from "react";
import styles from "../../styles/LandingPageMain.module.css";
import { Form, Input, Button } from "antd/lib";
import { ArrowRightOutlined } from "@ant-design/icons";

export default function ContactUs({ id }) {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    // todo: change
    console.log(values);
  };
  return (
    <div id={id} className={styles.contactUsScreenWrapper}>
      <div className={styles.contactUsFormSectionWrapper}>
        <div className={styles.contactUsTitleWrapper}>
          <span className={styles.contactUsTitle}>Contact Us</span>
        </div>
        <div className={styles.contactUsFormWrapper}>
          <Form
            form={form}
            className={styles.contactUsForm}
            name="contactUsForm"
            onFinish={onFinish}
          >
            <Form.Item
              name="Email Address"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                className={styles.contactUsInput}
                type="text"
                placeholder="Email Address"
              />
            </Form.Item>
            <Form.Item
              name="Name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input
                className={styles.contactUsInput}
                type="text"
                placeholder="Name"
              />
            </Form.Item>
            <Form.Item name="Business Name">
              <Input
                className={styles.contactUsInput}
                type="text"
                placeholder="Message"
              />
            </Form.Item>
            <Form.Item>
              <Button className={styles.contactUsSubmitButton} type="submit">
                Submit
                <ArrowRightOutlined />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={styles.contactUsImageSectionWrapper}>
        <div className={styles.contactUsImageDiv}>
          <img className={styles.contactUsImage} src="/receptionist.png" />
        </div>
      </div>
    </div>
  );
}
