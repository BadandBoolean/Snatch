import React from "react";
import { useEffect, useState, useForm } from "react";
import { List, Form, Input, Button } from "antd/lib";
import styles from "../styles/InfoBlocks.module.css";

export default function ServiceBlock({ salonId }) {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [form] = Form.useForm();
  const [changedService, setChangedService] = useState(false);

  useEffect(() => {
    fetch(`./api/getServices/${salonId}`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services);
        setServicesLoading(false);
      });
    setChangedService(false);
  }, [changedService]);

  const handleSubmitForm = async (values) => {
    const response = await fetch("./api/amendService", {
      method: "POST",
      body: JSON.stringify({
        action: "add",
        service: values.service,
        salonId: salonId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    form.resetFields();
    setChangedService(true);
  };

  const handleRemove = async (item) => {
    const response = await fetch("./api/amendService", {
      method: "POST",
      body: JSON.stringify({
        action: "remove",
        serviceId: item.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setChangedService(true);
  };

  return (
    <>
      {!servicesLoading && (
        <div className={styles.blockDivWrapper}>
          {services.length > 0 ? (
            <List
              style={{ minHeight: "20vh" }}
              dataSource={services}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      onClick={() => handleRemove(item)}
                      className={styles.removeButton}
                      key="remove"
                    >
                      remove
                    </a>,
                  ]}
                >
                  {item.name}
                </List.Item>
              )}
            />
          ) : (
            <p>No services yet!</p>
          )}
          <Form
            form={form}
            name="addService"
            initialValues={{
              service: "",
            }}
            onFinish={handleSubmitForm}
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Form.Item label="" name="service">
              <Input placeholder="Add a Service" maxLength={100} />
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                htmlType="submit"
                style={{ margin: "5px" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
}
