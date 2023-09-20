import React from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  DatePicker,
  TimePicker,
  Select,
  Button,
  Divider,
  Space,
} from "antd/lib";
import dayjs from "dayjs";
const { TextArea } = Input;
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
// SET USEFORM YOU DONT SET IT AND GET AN ERROR HERE!
const disabledDate = (current) => {
  // Can not select days before today only.
  return dayjs().endOf("day") > current && !current.isSame(dayjs(), "day");
};

export default function AddApptModal({
  handleCancel,
  handleSubmit,
  open,
  confirmLoading,
  form,
  salonId,
}) {
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [addStylist, setAddStylist] = useState("");
  const [addService, setAddService] = useState("");
  const [changeTrigger, setChangeTrigger] = useState(false);

  useEffect(() => {
    fetch(`./api/getServices/${salonId}`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services);
      });
    fetch(`./api/getStylists/${salonId}`)
      .then((res) => res.json())
      .then((data) => {
        setStylists(data.stylists);
      });
    setChangeTrigger(false);
  }, [changeTrigger]);

  const serviceOptions = services.map((service) => {
    return { label: service.name, value: service.name };
  });

  const stylistOptions = stylists.map((stylist) => {
    return { value: stylist.name, label: stylist.name };
  });

  const onAddStylist = (event) => {
    setAddStylist(event.target.value);
  };

  const onAddService = (event) => {
    setAddService(event.target.value);
  };

  const clickAddStylist = () => {
    fetch("./api/amendStylist", {
      method: "POST",
      body: JSON.stringify({
        action: "add",
        stylist: addStylist,
        salonId: salonId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setAddStylist("");
    setChangeTrigger(true);
  };

  const clickAddService = () => {
    fetch("./api/amendService", {
      method: "POST",
      body: JSON.stringify({
        action: "add",
        service: addService,
        salonId: salonId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setAddService("");
    setChangeTrigger(true);
  };

  return (
    <>
      <Modal
        title="Add New Appointment"
        open={open}
        onOk={form.submit}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            appttime: dayjs("12:00", "HH:mm"),
            price: 100,
            servicetype: "Any",
          }}
        >
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
            <Select
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Input
                      placeholder="Add a stylist"
                      onChange={onAddStylist}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={clickAddStylist}
                    >
                      Add Stylist
                    </Button>
                  </div>
                </>
              )}
              options={stylistOptions}
            />
          </Form.Item>
          <Form.Item label="Service" name="servicetype">
            <Select
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Input
                      placeholder="Add a service"
                      onChange={onAddService}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={clickAddService}
                    >
                      Add Service
                    </Button>
                  </div>
                </>
              )}
              options={serviceOptions}
            />
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
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              showCount
              maxLength={300}
              placeholder="e.g: 'Cash only for this appointment', 'Hair color not available'"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
