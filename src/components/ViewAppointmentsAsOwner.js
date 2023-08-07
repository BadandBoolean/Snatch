import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  TimePicker,
  Input,
  DatePicker,
  InputNumber,
} from "antd/lib";
import dayjs from "dayjs";
// logic if you do NOT have any appointments.
// logic to view appointments if you have them
// logic to edit appointments
// logic to delete appointments

export default function ViewAppointmentsAsOwner({
  appointments,
  handleDelete,
  showDeleteAppt,
  deleteApptOpen,
  confirmLoading,
  handleDontDelete,
  showEditAppt,
  editApptOpen,
  handleDontEdit,
  handleEditSubmit,
  editForm,
}) {
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "10%",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: "10%",
    },
    {
      title: "With",
      dataIndex: "whoWith",
      key: "whoWith",
      width: "10%",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      width: "10%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      width: "20%",
    },
    {
      title: "",
      key: "action",
      width: "30%",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => editAppt(record)}>Edit</Button>
          <Button danger onClick={() => showDeleteAppt(record.key)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const editAppt = (record) => {
    editForm.setFieldsValue({
      apptdate: dayjs(record.date),
      appttime: dayjs(record.time, "HH:mm"),
      stylist: record.whoWith,
      servicetype: record.service,
      price: record.price,
      notes: record.notes,
    });
    showEditAppt(record.key);
  };

  const dataSource = appointments.map((appointment) => {
    return {
      key: appointment.id,
      date: dayjs(appointment.date).format("MM/DD/YYYY"),
      time: dayjs(appointment.time).format("HH:mm"),
      whoWith: appointment.whoWith,
      service: appointment.service,
      price: appointment.price,
      notes: appointment.notes,
    };
  });

  return (
    <>
      <div style={{ width: "100%" }}>
        {dataSource.length > 0 ? (
          <Table columns={columns} dataSource={dataSource} />
        ) : (
          <p>You have no last minute appointments available! Woohoo!</p>
        )}
      </div>
      <Modal
        title="Did someone book this appointment?"
        open={deleteApptOpen}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        onCancel={handleDontDelete}
      >
        <p>
          Are you sure you want to delete it?
          <br />
          You can`&apos;`t undo this action!
        </p>
      </Modal>
      <Modal
        getContainer={false}
        title="Edit Appointment"
        open={editApptOpen}
        onOk={editForm.submit}
        confirmLoading={confirmLoading}
        onCancel={handleDontEdit}
      >
        <Form form={editForm} onFinish={handleEditSubmit}>
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
