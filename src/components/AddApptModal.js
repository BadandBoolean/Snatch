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
import buttonstyles from "../styles/PublicHome.module.css";

export default function AddApptModal({
  handleCancel,
  handleSubmit,
  open,
  confirmLoading,
  form,
}) {
  return (
    <>
      <Modal
        title="Add New Appointment"
        open={open}
        onOk={form.submit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            appttime: dayjs("12:00", "HH:mm"),
            price: 100,
          }}
        >
          <Form.Item
            label="Appointment Time"
            name="appttime"
            rules={[
              {
                required: true,
                message: "Please input your appointment time!",
              },
            ]}
          >
            <TimePicker format={"HH:mm"} />
          </Form.Item>
          <Form.Item
            label="Appointment Date"
            name="apptdate"
            rules={[
              {
                required: true,
                message: "Please input your appointment date!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Stylist"
            name="stylist"
            rules={[
              {
                required: true,
                message: "Please input the name of the stylist",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Service Type" name="servicetype">
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input the price of the service!",
              },
            ]}
          >
            <InputNumber addonBefore="$" />
          </Form.Item>
          <Form.Item label="Additional Information" name="notes">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
