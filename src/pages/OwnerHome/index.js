import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession, getSession } from "next-auth/react";
import AddApptModal from "../../components/AddApptModal.js";
import ViewAppointmentsAsOwner from "../../components/ViewAppointmentsAsOwner.js";
import prisma from "../../../lib/prisma";
import { Form, Button } from "antd/lib";
import { useRouter } from "next/router";
import Link from "next/link";
import EditSalonInfo from "../../components/EditSalonInfo.js";
import styles from "../../styles/OwnerHome.module.css";
import buttonstyles from "../../styles/PublicHome.module.css";

// TODO LIST:

// ADD PINWHEEL FOR SERVER-SIDE RENDERING OF APPOINTMENTS
// Change default vals to initial vals to get rid of console error
// add a sign out button.
// add a go to see appointments as salon owner button.
// create the list to view appointments!

// only access this page if you are logged in??? or else u gotta redirect to log in ??????????
// something like 'owners access only'
export default function OwnerHome({
  userDetails,
  allAppointments,
  salonDetails,
}) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteApptOpen, setDeleteApptOpen] = useState(false);
  const [apptId, setApptId] = useState(null);
  const [editApptOpen, setEditApptOpen] = useState(false);
  const [editSalonOpen, setEditSalonOpen] = useState(false);
  const [editSalonForm] = Form.useForm();

  useEffect(() => {
    setIsRefreshing(false);
  }, [allAppointments, salonDetails, userDetails]);

  // refresh data on page when a new query is added to DB.
  const refreshData = () => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  };

  if (session === undefined) {
    return <p>Loading...</p>;
  }

  // deny access if user is not logged in as salon owner - also add option that if user is authenticated BUT doesn't have a salon?
  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (!userDetails.hasSalon) {
    return <p>You don&apos;t have a salon!</p>;
  }

  const showEditAppt = (apptid) => {
    console.log("key is " + apptid);
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
    console.log(salonDetails);
    editSalonForm.setFieldsValue({
      salonname: salonDetails.name,
      salonphone: salonDetails.phone,
      salonaddress: salonDetails.address,
      bookingOptions: salonDetails.bookingOptions,
      bookingInfo: salonDetails.bookingInfo,
    });

    setEditSalonOpen(true);
  };

  const handleEditSalonCancel = () => {
    setEditSalonOpen(false);
    editSalonForm.resetFields();
  };

  const handleDelete = async () => {
    if (!!session && !!userDetails) {
      console.log("session and user exist");
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
    }, 2000);
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
    console.log(JSON.stringify(values));
    if (!!session && !!userDetails) {
      console.log("session and user exist");
      const response = await fetch("./api/editSalon", {
        method: "POST",
        body: JSON.stringify({
          salonId: salonDetails.id,
          salonname: values.salonname,
          salonphone: values.salonphone,
          salonaddress: values.salonemailaddress,
          bookingInfo: values.bookingInfo,
          bookingOptions: values.bookingOptions,
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
    }, 2000);
    editSalonForm.resetFields();
    refreshData();
  };

  const handleEditSubmit = async (values) => {
    console.log(JSON.stringify(values));

    if (!!session && !!userDetails) {
      console.log("session and user exist");

      const response = await fetch("./api/editAppointment", {
        method: "POST",
        body: JSON.stringify({
          id: apptId,
          appttime: values.appttime,
          apptdate: values.apptdate,
          stylist: values.stylist,
          price: values.price,
          servicetype: values.servicetype,
          notes: values.notes,
          salonname: salonDetails.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const sendmessage = await fetch("./api/textAdminNumber", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    setConfirmLoading(true);
    setTimeout(() => {
      setEditApptOpen(false);
      setConfirmLoading(false);
    }, 2000);
    // now have to reload window to see new appointment
    form.resetFields();
    refreshData();
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    if (!!session && !!userDetails) {
      console.log("session and user exist");
      //console.log(session.user.id);
      // console.log("id");
      const response = await fetch("./api/addAppointment", {
        method: "POST",
        body: JSON.stringify({
          appttime: values.appttime,
          apptdate: values.apptdate,
          stylist: values.stylist,
          price: values.price,
          servicetype: values.servicetype,
          notes: values.notes,
          salonname: salonDetails.name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const sendmessage = await fetch("./api/textAdminNumber", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
    // now have to reload window to see new appointment
    form.resetFields();
    refreshData();
  };
  return (
    <>
      <div className={styles.InfoTextWrapper} style={{ margin: "10px" }}>
        <div className={styles.InfoTextBox}>
          <span className={styles.InfoTextStyle}>
            Salon: {salonDetails.name}
          </span>
        </div>
      </div>
      <div className={styles.buttonBarWrapper}>
        <div className={styles.buttonBar}>
          <Button className={buttonstyles.ownerHomeButton} onClick={showModal}>
            <span className={buttonstyles.buttonText}>Add New Appointment</span>
          </Button>

          <Button
            className={buttonstyles.ownerHomeButton}
            onClick={showSalonEditModal}
          >
            <span className={buttonstyles.buttonText}>
              Edit Salon Information
            </span>
          </Button>

          <Button className={buttonstyles.ownerHomeButton}>
            <Link className={buttonstyles.buttonText} href="/">
              Home
            </Link>
          </Button>
        </div>
      </div>
      <AddApptModal
        showModal={showModal}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        confirmLoading={confirmLoading}
        open={open}
        form={form}
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
  if (!!session) {
    appointment = await prisma.appointment.findMany({});
    console.log(appointment);
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
  }
  console;
  return {
    props: {
      userDetails: user || null,
      allAppointments: JSON.parse(JSON.stringify(appointment)) || null,
      salonDetails: salon || null,
    },
  };
}
