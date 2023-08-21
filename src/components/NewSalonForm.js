import React from "react";
import { Form, Input, Button, Checkbox, Modal, InputNumber } from "antd/lib";
const { TextArea } = Input;

export default function NewSalonForm({
  handleFinishForm,
  newSalonModalOpen,
  newSalonForm,
  handleCancelNewSalon,
}) {
  return (
    <Modal
      title="Looks like we don't have your salon yet! Register your salon below"
      open={newSalonModalOpen}
      onOk={newSalonForm.submit}
      onCancel={handleCancelNewSalon}
      footer={[
        <Button key="back" onClick={handleCancelNewSalon}>
          I&apos;ll set this up later
        </Button>,
        <Button key="submit" type="primary" onClick={newSalonForm.submit}>
          Submit
        </Button>,
      ]}
    >
      <Form name="basic" onFinish={handleFinishForm} form={newSalonForm}>
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
          <Input maxLength={30} />
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
          <Input
            addonBefore="+1"
            maxLength={12}
            style={{ width: "100%" }}
            placeholder="xxx xxx xxxx"
          />
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
          <Input maxLength={50} />
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
        <Form.Item name="bookingInfo" label="Additional Info">
          <TextArea
            showCount
            autoSize={{ minRows: 3, maxRows: 5 }}
            maxLength={300}
            placeholder="Add any additional information for clients to know before they book an appointment e.g 'First-come, first-served', 'Walk-ins welcome'"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
