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

export default function GetContactInfoForm({
  addContactInfoForm,
  handleAddContactInfo,
}) {
  return (
    <>
      <h3>Want to get notified when this salon has availability?</h3>
      <Form form={addContactInfoForm} onFinish={handleAddContactInfo}>
        <Form.Item label="Email Address" name="emailaddress">
          <Input placeholder="Enter your email address (optional)" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phonenumber">
          <Input placeholder="Enter your phone number (optional)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
