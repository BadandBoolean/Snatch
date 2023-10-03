// admin page for sending texts during the prototype phase. to be accessed only by me.
import { useSession, getSession } from "next-auth/react";
import { Form, Input, Button, Spin } from "antd/lib";
import { useLogger } from "next-axiom";
import { useState } from "react";
const { TextArea } = Input;
import prisma from "../../../lib/prisma";
import AddAptAdmn from "../../components/AddAptAdmn";

export default function GetHyped({ userDetails }) {
  const { data: session, status } = useSession();
  const log = useLogger();
  const [sendTextForm] = Form.useForm();
  const [isTextSent, setIsTextSent] = useState(false);
  const [apptform] = Form.useForm();

  if (session === undefined) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "80%",
          }}
        >
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <p>Access Denied</p>;
  }

  //deny access if the email of the logged in user is not my email
  if (session.user.email !== "team@wearesnatch.com") {
    return <p>Access Denied</p>;
  }
  // ...two ways
  if (userDetails.email !== "team@wearesnatch.com") {
    return <p>Access Denied</p>;
  }

  // deny access if user is not logged in as salon owner - also add option that if user is authenticated BUT doesn't have a salon?
  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  const handleFinishForm = async (values) => {
    const textBody = values.textBody;
    const textNumber = values.textNumber;
    const response = await fetch("./api/getHype", {
      method: "POST",
      body: JSON.stringify({
        textBody: textBody,
        textNumber: textNumber,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    log.info(`sent a text to ${textNumber}`);
    log.info(response);
    sendTextForm.resetFields();
    setIsTextSent(true);
  };

  const handleFinishApptForm = async (values) => {
    const response = await fetch("./api/addApptHype", {
      method: "POST",
      body: JSON.stringify({
        salonname: values.salonname,
        appttime: values.appttime,
        apptdate: values.apptdate,
        stylist: values.stylist,
        servicetype: values.servicetype,
        price: values.price,
        notes: values.notes,
        location: values.location,
        zipcode: values.zipcode,
        bookingLink: values.bookingLink,
        bookingPhone: values.bookingPhone,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    apptform.resetFields();
    log.info(response);
  };
  // return a form to fill out with the text body and the phone number to text
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          width: "100%",
        }}
      >
        {isTextSent && <p>Text sent!</p>}
        <Form
          form={sendTextForm}
          onFinish={handleFinishForm}
          name="basic"
          initialValues={{
            textBody:
              "There is an appointment available at SALONNAME!\n\nDetails: DATE at TIME\nAvailable Stylist: STYLIST\nAvailable Service(s): Any\nPrice: Inquire for more.\nSalon location: LOCATION\nCall salon to schedule or visit their website\n\nBrought to you by Snatch.\n\nText STOP to unsubscribe.",
            textNumber: "",
          }}
        >
          <Form.Item
            label="Text Body"
            name="textBody"
            rules={[
              {
                required: true,
                message: "Please input the text body",
              },
            ]}
          >
            <TextArea showCount autoSize={{ minRows: 3, maxRows: 20 }} />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="textNumber"
            rules={[
              {
                required: true,
                message: "Please input the phone number",
              },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <AddAptAdmn
          apptform={apptform}
          handleFinishApptForm={handleFinishApptForm}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let session = await getSession(context);
  let user = null;

  if (!!session) {
    user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
  }
  return {
    props: {
      userDetails: user || null,
    },
  };
}
