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
import styles from "../styles/tables.module.css";
const { TextArea } = Input;
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
  // expanded columns
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "With",
        dataIndex: "whoWith",
        key: "whoWith",
      },
      {
        title: "Service",
        dataIndex: "service",
        key: "service",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Notes",
        dataIndex: "notes",
        key: "notes",
        responsive: ["xs", "sm", "md", "lg", "xl"],
      },
    ];
    const data = [
      {
        key: record.id,
        whoWith: record.whoWith,
        service: record.service,
        price: record.price,
        notes: record.notes,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    );
  };

  // regular columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "",
      key: "action",

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

  const disabledDate = (current) => {
    // Can not select days before today only.
    return dayjs().endOf("day") > current && !current.isSame(dayjs(), "day");
  };

  return (
    <>
      <div className={styles.appTableOwner}>
        {dataSource.length > 0 ? (
          <Table
            columns={columns}
            expandable={{
              expandedRowRender,
              defaultExpandedRowKeys: ["0"],
            }}
            dataSource={dataSource}
            size="small"
          />
        ) : (
          <p style={{ margin: "10px", textAlign: "center" }}>
            You haven&apos;t got any last minute appointments listed!
          </p>
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
          You can&apos;t undo this action!
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
            <DatePicker disabledDate={disabledDate} />
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
            <TextArea showCount maxLength={300} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
