// a component which filters based on how far away the location of the appointment is from user.
// basically a form then
import React from "react";
import { Input, Form, Select, Button } from "antd/lib";
import styles from "../styles/salonselect.module.css";
import { useWindowSize } from "@uidotdev/usehooks";

export default function FilterByLocation({ handleFilterLocation }) {
  let size = useWindowSize();
  // make the options 1, 3, 5, 10, 25 but add on miles in the list to each of them
  const options = [1, 3, 5, 10, 25].map((distance) => {
    return {
      value: distance,
      label: distance + (distance === 1 ? " mile" : " miles"),
    };
  });

  return (
    <Form
      className={styles.formwidth}
      onFinish={handleFilterLocation}
      layout={size.width > 720 ? "inline" : "horizontal"}
    >
      <Form.Item name="zipcode">
        <Input placeholder="Filter by zip code" />
      </Form.Item>
      <Form.Item name="radius">
        <Select placeholder="Distance (miles)" options={options} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
    </Form>
  );
}
