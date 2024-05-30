import React, { useState } from "react";
import styles from "../../styles/LandingPageMain.module.css";
import { Form, Input, Button, message } from "antd/lib";
import { ArrowRightOutlined } from "@ant-design/icons";

export default function ContactUs({ id }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // post the values to api addNewEmailSignUp
    const response = await fetch("/api/addNewEmailSignUp", {
      method: "POST",
      body: JSON.stringify({
        email: values.email,
        name: values.name,
        businessname: values.businessname,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    form.resetFields();
    messageApi.open({
      content: "Thank you for your interest! We will reach out to you soon.",
      duration: 5,
      type: "success",
    });
  };
  return (
    <div id={id} className={styles.contactUsScreenWrapper}>
      {contextHolder}
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
              name="email"
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
              name="name"
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
            <Form.Item name="businessname">
              <Input
                className={styles.contactUsInput}
                type="text"
                placeholder="Business Name"
              />
            </Form.Item>
            <Form.Item>
              <Button
                className={styles.contactUsSubmitButton}
                htmlType="submit"
              >
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
