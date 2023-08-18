import { useState, useEffect } from "react";
import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  DatePicker,
  TimePicker,
  Checkbox,
} from "antd/lib";
import dayjs from "dayjs";
const { TextArea } = Input;

export default function EditSalonInfo({
  editSalonOpen,
  editSalonForm,
  handleEditSalonCancel,
  confirmLoading,
  handleEditSalonSubmit,
}) {
  return (
    <>
      <Modal
        title="Edit Salon Information"
        open={editSalonOpen}
        onOk={editSalonForm.submit}
        confirmLoading={confirmLoading}
        onCancel={handleEditSalonCancel}
      >
        <Form form={editSalonForm} onFinish={handleEditSalonSubmit}>
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
            <Input maxLength={10} />
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
              placeholder="Add any additional information for clients to know before they book an appointment e.g 'First-come, first-served', 'Walk-ins welcome'"
              maxLength={300}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
