import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  DatePicker,
  TimePicker,
  Select,
  Button,
  Divider,
  Space,
} from "antd/lib";
import dayjs from "dayjs";
const { TextArea } = Input;
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
// SET USEFORM YOU DONT SET IT AND GET AN ERROR HERE!
const disabledDate = (current) => {
  // Can not select days before today only.
  return dayjs().endOf("day") > current && !current.isSame(dayjs(), "day");
};

export default function AddApptModal({
  handleCancel,
  handleSubmit,
  open,
  confirmLoading,
  form,
  salonId,
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
            appttime: dayjs("12:00", "hh:mm"),
            price: "100",
            servicetype: "Any",
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
            <TimePicker minuteStep={15} format={"hh:mm a"} />
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
            <DatePicker disabledDate={disabledDate} />
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
            <Input placeholder="e.g 150-275" addonBefore="$" />
          </Form.Item>
          <Form.Item label="Additional Information" name="notes">
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              showCount
              maxLength={300}
              placeholder="e.g: 'Cash only for this appointment', 'Hair color not available'"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
