import { useState, useEffect } from "react";
import React from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  TimePicker,
  Checkbox,
  InputNumber,
} from "antd/lib";
import dayjs from "dayjs";
import { MaskedInput } from "antd-mask-input";
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
        title="Edit Your Profile"
        open={editSalonOpen}
        onOk={editSalonForm.submit}
        confirmLoading={confirmLoading}
        onCancel={handleEditSalonCancel}
      >
        <Form form={editSalonForm} onFinish={handleEditSalonSubmit}>
          <Form.Item
            label="Name"
            name="salonname"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input maxLength={30} />
          </Form.Item>
          <Form.Item label="Phone" name="salonphone">
            <Input
              addonBefore="+1"
              maxLength={12}
              style={{ width: "100%" }}
              placeholder="xxx xxx xxxx"
            />
          </Form.Item>
          <Form.Item
            label="Website" // CHANGE!!!!!!!
            name="salonemailaddress"
          >
            <Input
              addonBefore="www."
              onInput={(e) => (e.target.value = e.target.value.toLowerCase())}
              maxLength={50}
            />
          </Form.Item>
          <Form.Item
            name="bookingOptions"
            label="How can clients book an appointment with you?"
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
              placeholder="Add any additional information for clients to know before they book an appointment e.g 'First-come, first-served', 'Walk-ins welcome'"
              maxLength={300}
            />
          </Form.Item>
          <div>
            <p>
              <span style={{ color: "red" }}>**NEW**</span> Type in the iCal URL
              for your existing booking software calendar to start tracking your
              cancellations! <br /> Instructions for how to find your iCal URL:
              <br />
              <a
                href="https://support.schedulicity.com/en/articles/956383-how-do-i-share-schedulicity-to-my-calendar"
                target="_blank"
                rel="noopener noreferrer"
              >
                Schedulicity
              </a>
              <br />
              <a
                href="https://support.vagaro.com/hc/en-us/articles/204347720-How-to-Share-Your-Vagaro-Calendar"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vagaro
              </a>
              <br />
              <a
                href="https://glossgenius.com/blog/getting-started-with-glossgenius"
                target="_blank"
                rel="noopener noreferrer"
              >
                GlossGenius
              </a>
            </p>
          </div>
          <Form.Item name="calendarUrl" label="Calendar URL">
            <Input placeholder=" e.g https://calendar.google.com/calendar/ical/4742874247294729429group.calendar.google.com/public/basic.ics" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
