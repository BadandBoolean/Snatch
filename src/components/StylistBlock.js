import React from "react";
import { useEffect, useState, useForm } from "react";
import { List, Form, Input, Button } from "antd/lib";
import styles from "../styles/InfoBlocks.module.css";

export default function StylistBlock({ salonId }) {
  const [stylists, setStylists] = useState([]);
  const [stylistsLoading, setStylistsLoading] = useState(true);
  const [form] = Form.useForm();
  const [changedStylist, setChangedStylist] = useState(false);

  useEffect(() => {
    fetch(`./api/getStylists/${salonId}`)
      .then((res) => res.json())
      .then((data) => {
        setStylists(data.stylists);
        setStylistsLoading(false);
      });
    setChangedStylist(false);
  }, [changedStylist]);

  const handleSubmitForm = async (values) => {
    const response = await fetch("./api/amendStylist", {
      method: "POST",
      body: JSON.stringify({
        action: "add",
        stylist: values.stylist,
        salonId: salonId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    form.resetFields();
    // refreshes the component?
    setChangedStylist(true);
  };

  const handleRemove = async (item) => {
    const response = await fetch("./api/amendStylist", {
      method: "POST",
      body: JSON.stringify({
        action: "remove",
        stylistId: item.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setChangedStylist(true);
  };

  return (
    <>
      {!stylistsLoading && (
        <div className={styles.blockDivWrapper}>
          {stylists.length > 0 ? (
            <List
              style={{ minHeight: "20vh" }}
              dataSource={stylists}
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
            <p>No stylists yet!</p>
          )}
          <Form
            form={form}
            name="addStylist"
            initialValues={{
              stylist: "",
            }}
            onFinish={handleSubmitForm}
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Form.Item label="" name="stylist">
              <Input placeholder="Add a Stylist" maxLength={30} />
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
