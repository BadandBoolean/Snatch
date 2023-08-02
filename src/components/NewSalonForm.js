import React from "react";
import { Form, Input, Button } from "antd/lib";

export default function NewSalonForm({ handleFinishForm }) {
  return (
    <>
      <div>
        <h3>Looks like you don't have a salon yet! Register one below</h3>
        <Form name="basic" onFinish={handleFinishForm}>
          <Form.Item
            label="Salon Name"
            name="salonname"
            rules={[
              {
                required: true,
                message: "Please input your Salon's name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="salonphone"
            rules={[
              {
                required: true,
                message: "Please input your Salon's contact number!", // on second thoughts is this needed?
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email Address"
            name="salonemailaddress"
            rules={[
              {
                required: true,
                message: "Please input your Salon's Email Address!", // EMAIL ADDRESS not physical address!
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bookingOptions"
            label="How can clients book an appointment?"
          >
            <Checkbox.Group>
              <Checkbox value="website">Website</Checkbox>
              <Checkbox value="Phone">Phone</Checkbox>
              <Checkbox value="Walk-in">Walk-in</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="bookingInfo" label="Additional Booking Information">
            <Input placeholder="Add any additional information for clients to know before they book an appointment" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
