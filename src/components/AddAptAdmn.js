import React from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  InputNumber,
} from "antd/lib";
import dayjs from "dayjs";
const { TextArea } = Input;

// submitting this form adds a new appointment to the database and displays it on the home screen. (and in the appointments tab)
// display form data like that which is in add apt modal but also add address.
export default function AddAptAdmn({ handleFinishApptForm, apptform }) {
  return (
    <>
      <Form
        form={apptform}
        onFinish={handleFinishApptForm}
        initialValues={{
          appttime: dayjs("12:00", "hh:mm a"),
          price: 100,
          servicetype: "Any",
        }}
      >
        <Form.Item
          label="Salon Name"
          name="salonname"
          rules={[
            {
              required: true,
              message: "Please input the name of the salon",
            },
          ]}
        >
          <Input />
        </Form.Item>
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
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input the price",
            },
          ]}
        >
          <Input placeholder="e.g 150-275" addonbefore="$" />
        </Form.Item>
        <Form.Item
          label="Physical Address"
          name="location"
          rules={[
            {
              required: true,
              message: "Please input the physical address",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Zip Code"
          name="zipcode"
          rules={[
            {
              required: true,
              message: "Please input the zip code",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Additional Information" name="notes">
          <TextArea
            autoSize={{ minRows: 3, maxRows: 5 }}
            showCount
            maxLength={300}
            placeholder="e.g: 'Cash only for this appointment', 'Hair color not available'"
          />
        </Form.Item>
        <Form.Item label="Booking Link (full)" name="bookingLink">
          <Input />
        </Form.Item>
        <Form.Item label="Booking Phone (with + 1)" name="bookingPhone">
          <Input />
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
