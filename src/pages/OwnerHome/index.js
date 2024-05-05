import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import AddApptModal from "../../components/AddApptModal.js";
import ViewAppointmentsAsOwner from "../../components/ViewAppointmentsAsOwner.js";
import prisma from "../../../lib/prisma";
import { Form, Button, Spin, Tabs } from "antd/lib";
import { useRouter } from "next/router";
import EditSalonInfo from "../../components/EditSalonInfo.js";
import styles from "../../styles/OwnerHome.module.css";
import contactformstyles from "../../styles/ContactForm.module.css";
import buttonstyles from "../../styles/PublicHome.module.css";
import dayjs from "dayjs";

export default function OwnerHome({
  userDetails,
  allAppointments,
  salonDetails,
  realSalon,
}) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const router = useRouter();
  const [deleteApptOpen, setDeleteApptOpen] = useState(false);
  const [apptId, setApptId] = useState(null);
  const [editApptOpen, setEditApptOpen] = useState(false);
  const [editSalonOpen, setEditSalonOpen] = useState(false);
  const [editSalonForm] = Form.useForm();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isRedirectingSalon, setIsRedirectingSalon] = useState(false);

  useEffect(() => {}, [allAppointments, salonDetails, userDetails, realSalon]);

  // refresh data on page when a new query is added to DB.
  const refreshData = () => {
    router.replace(router.asPath);
  };

  if (session === undefined) {
    return (
      <div className={styles.loadingDivWrapper}>
        <Spin size="large" />
      </div>
    );
  }

  // deny access if user is not logged in as salon owner - also add option that if user is authenticated BUT doesn't have a salon?
  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (!userDetails.hasSalon) {
    return <p>You don&apos;t have a profile!</p>;
  }

  const showEditAppt = (apptid) => {
    // console.log("key is " + apptid);
    setApptId(apptid);
    setEditApptOpen(true);
  };

  const showModal = () => {
    setOpen(true);
  };

  const showDeleteAppt = (apptid) => {
    setApptId(apptid);
    setDeleteApptOpen(true);
  };

  const showSalonEditModal = () => {
    // console.log(salonDetails);
    // console.log(realSalon.salonname); BUG!!!!!
    editSalonForm.setFieldsValue({
      salonname: salonDetails.name,
      salonphone: salonDetails.phone,
      salonemailaddress: salonDetails.address,
      bookingOptions: salonDetails.bookingOptions,
      bookingInfo: salonDetails.bookingInfo,
      calendarUrl: salonDetails.calendarUrl,
      realSalon: realSalon ? realSalon.salonname : "",
    });

    setEditSalonOpen(true);
  };

  const handleEditSalonCancel = () => {
    setEditSalonOpen(false);
    editSalonForm.resetFields();
  };

  const handleDelete = async () => {
    if (!!session && !!userDetails) {
      // console.log("session and user exist");
      const response = await fetch("./api/deleteAppointment", {
        method: "POST",
        body: JSON.stringify({
          id: apptId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    setConfirmLoading(true);
    setTimeout(() => {
      setDeleteApptOpen(false);
      setConfirmLoading(false);
    }, 100);
    refreshData();
  };

  const handleDontDelete = () => {
    setApptId(null);
    setDeleteApptOpen(false);
  };

  const handleDontEdit = () => {
    setEditApptOpen(false);
    editForm.resetFields();
  };

  const handleEditSalonSubmit = async (values) => {
    // console.log(JSON.stringify(values));
    if (!!session && !!userDetails) {
      // console.log("session and user exist");
      const response = await fetch("./api/editSalon", {
        method: "POST",
        body: JSON.stringify({
          salonId: salonDetails.id,
          salonname: values.salonname,
          salonphone: values.salonphone,
          salonaddress: values.salonemailaddress,
          bookingInfo: values.bookingInfo,
          bookingOptions: values.bookingOptions,
          calendarUrl: values.calendarUrl,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    setConfirmLoading(true);
    setTimeout(() => {
      setEditSalonOpen(false);
      setConfirmLoading(false);
    }, 100);
    editSalonForm.resetFields();
    refreshData();
  };

  const handleEditSubmit = async (values) => {
    // console.log(JSON.stringify(values));

    if (!!session && !!userDetails) {
      // console.log("session and user exist");

      const response = await fetch("./api/editAppointment", {
        method: "POST",
        body: JSON.stringify({
          id: apptId,
          appttime: values.appttime,
          apptdate: values.apptdate,
          price: values.price,
          notes: values.notes,
          salonname: salonDetails.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    setConfirmLoading(true);
    setTimeout(() => {
      setEditApptOpen(false);
      setConfirmLoading(false);
    }, 100);
    // now have to reload window to see new appointment
    form.resetFields();
    refreshData();
  };

  const handleCancel = () => {
    // console.log("Clicked cancel button");
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    if (!!session && !!userDetails) {
      // console.log("session and user exist");
      //console.log(session.user.id);
      // console.log("id");
      const response = await fetch("./api/addAppointment", {
        method: "POST",
        body: JSON.stringify({
          appttime: values.appttime,
          apptdate: values.apptdate,
          price: values.price,
          notes: values.notes,
          salonname: salonDetails.name,
          servicetype: salonDetails.servicetype,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // convert to format
      const convertedTime = dayjs(values.appttime).format("h:mm A");

      // generate the query data.
      const queryData = {
        salonId: salonDetails.id,
        salonName: salonDetails.name,
        apptDate: values.apptdate,
        apptTime: convertedTime,
        apptPrice: values.price,
        changeType: "add",
      };

      const sendmessage = await fetch("./api/textSubscribers", {
        method: "POST",
        body: JSON.stringify(queryData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 100);
    // now have to reload window to see new appointment
    form.resetFields();
    refreshData();
  };

  const handleGoHome = () => {
    setIsRedirecting(true);
    router.push("/");
  };

  const handleGoRealSalonPage = () => {
    setIsRedirectingSalon(true);
    router.push(`/places/${realSalon.id}`);
  };

  return (
    <>
      <div className={styles.colourWrapper}>
        <img src="/ggoh.jpg" alt="logo" className={styles.ggohreg} />
        <img src="/ggoh.jpg" alt="logo" className={styles.ggohmobile} />
        <div className={contactformstyles.contactOuterDivoh}>
          <div className={contactformstyles.contactMiddleDivoh}>
            <div className={contactformstyles.contactDivoh}>
              <div className={styles.InfoTextWrapper}>
                <div className={styles.InfoTextBox}>
                  <span className={styles.InfoTextStyle}>
                    {salonDetails.name}
                  </span>
                </div>
              </div>
              <div className={styles.InfoTextWrapper}>
                {realSalon && (
                  <div className={styles.InfoTextBox}>
                    <span className={styles.InfoTextStyleSalonName}>
                      {realSalon.salonname}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonBarWrapper}>
          <div className={styles.buttonBar}>
            <div className={styles.buttBox}>
              <Button
                className={buttonstyles.salonOwnerHomeButton}
                onClick={showModal}
              >
                <span className={buttonstyles.buttonText}>
                  Add New Appointment
                </span>
              </Button>
            </div>
            <div className={styles.buttBox}>
              <Button
                className={buttonstyles.salonOwnerHomeButton}
                onClick={showSalonEditModal}
              >
                <span className={buttonstyles.buttonText}>Edit Profile</span>
              </Button>
            </div>
            <div className={styles.buttBox}>
              <Button
                className={buttonstyles.salonOwnerHomeButton}
                onClick={handleGoHome}
              >
                {isRedirecting ? (
                  <Spin />
                ) : (
                  <span
                    style={{ paddingRight: "50px", paddingLeft: "50px" }}
                    className={buttonstyles.buttonTextSalon}
                  >
                    Home
                  </span>
                )}
              </Button>
            </div>
            {realSalon && (
              <div className={styles.buttBox}>
                <Button
                  className={buttonstyles.salonOwnerHomeButton}
                  onClick={handleGoRealSalonPage}
                >
                  {isRedirectingSalon ? (
                    <Spin />
                  ) : (
                    <span className={buttonstyles.buttonTextSalon}>
                      {realSalon.salonname}
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AddApptModal
        showModal={showModal}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        confirmLoading={confirmLoading}
        open={open}
        form={form}
        salonId={salonDetails.id}
      />
      <ViewAppointmentsAsOwner
        appointments={allAppointments}
        handleDelete={handleDelete}
        showDeleteAppt={showDeleteAppt}
        showEditAppt={showEditAppt}
        editApptOpen={editApptOpen}
        deleteApptOpen={deleteApptOpen}
        confirmLoading={confirmLoading}
        handleDontDelete={handleDontDelete}
        handleDontEdit={handleDontEdit}
        handleEditSubmit={handleEditSubmit}
        editForm={editForm}
        salonId={salonDetails.id}
      />
      <EditSalonInfo
        editSalonOpen={editSalonOpen}
        editSalonForm={editSalonForm}
        handleEditSalonCancel={handleEditSalonCancel}
        confirmLoading={confirmLoading}
        handleEditSalonSubmit={handleEditSalonSubmit}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  let user = null;
  let salon = null;
  let appointment = null;
  let realSalon = null;
  if (!!session) {
    user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    salon = await prisma.salon.findUnique({
      where: {
        ownerId: user.id,
      },
    });
    appointment = await prisma.appointment.findMany({
      where: {
        salonId: salon.id,
      },
    }); // this should fix things...
    console.log(salon.hasRealSalon);
    // find the realsalon
    if (salon.hasRealSalon) {
      console.log("has real salon");
      realSalon = await prisma.realSalon.findUnique({
        where: {
          id: salon.realSalonId,
        },
      });
    }
  }

  return {
    props: {
      userDetails: user || null,
      allAppointments: JSON.parse(JSON.stringify(appointment)) || null,
      salonDetails: salon || null,
      realSalon: realSalon || null,
    },
  };
}
