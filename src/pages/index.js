import { useSession, getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import NewSalonForm from "../components/NewSalonForm.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "antd/lib";
import Link from "next/link";
import HomeAppointmentsView from "../components/HomeAppointmentsView.js";
import GetContactInfoForm from "../components/GetContactInfoForm.js";
import { Form } from "antd/lib";
import Hero from "../components/Hero";
import styles from "../styles/PublicHome.module.css";

export default function Home({
  userDetails,
  allAppointments,
  salonDetails,
  salonInfoPublic,
}) {
  const { data: session, status } = useSession(); // object, not array
  const router = useRouter();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [addContactInfoForm] = Form.useForm();
  const [hydrated, setHydrated] = useState(false);
  const [newSalonModalOpen, setNewSalonModalOpen] = useState(true);
  const [newSalonForm] = Form.useForm();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const handleFinishForm = async (values) => {
    // values.preventDefault();
    console.log(session);
    console.log(userDetails);

    if (!!session && !!userDetails) {
      console.log("session and user exist");
      const response = await fetch("./api/registerNewSalon", {
        method: "POST",
        body: JSON.stringify({
          salonName: values.salonname,
          salonPhone: values.salonphone,
          salonEmail: values.salonemailaddress,
          bookingInfo: values.bookingInfo,
          bookingOptions: values.bookingOptions,
        }), // might not be the way to do this... could also be values[0]
        headers: {
          "Content-Type": "application/json",
        },
      });
      // here we ideally want to refresh the whole page? such that it shows that you have the salon now.
      // so we do this:
      window.location.reload();
      // holy fucking shit that worked. nice.
      if (userDetails.hasSalon) {
        router.push("/OwnerHome");
      }
    }
  };

  const handleAddContactInfo = async (values) => {
    if (values.phone || values.email) {
      const response = await fetch("./api/AddClientDetails", {
        method: "POST",
        body: JSON.stringify({
          phone: values.phonenumber,
          email: values.emailaddress,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    addContactInfoForm.resetFields();
  };

  const showBookingModal = () => {
    setBookingModalOpen(true);
  };

  const handleOkBookingModal = () => {
    setBookingModalOpen(false);
  };

  const showInfoModal = () => {
    setInfoModalOpen(true);
  };

  const handleOkInfoModal = () => {
    setInfoModalOpen(false);
  };

  const openMakeNewSalonModal = () => {
    setNewSalonModalOpen(true);
    console.log("we are in this modal");
  };

  const handleCancelNewSalon = () => {
    setNewSalonModalOpen(false);
  };

  return (
    <>
      <Hero />
      {status === "loading" && <h2>Loading ...</h2>}
      {status === "authenticated" && (
        <>
          <br />
          <div className={styles.signedInHasSalonDivWrapper}>
            <div className={styles.signedInHasSalonDiv}>
              <p className={styles.welcomeBackText}>
                Welcome Back, {session.user.name}
              </p>
              <div className={styles.buttonBoxMobileOnly}>
                {!!userDetails && !userDetails.hasSalon ? (
                  <Button
                    onClick={openMakeNewSalonModal}
                    className={styles.ownerHomeButton}
                  >
                    <span className={styles.buttonText}>
                      Register your Salon
                    </span>
                  </Button>
                ) : (
                  <Button className={styles.ownerHomeButton}>
                    <Link className={styles.buttonText} href="/OwnerHome">
                      {salonDetails.name} Home Page
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <NewSalonForm
        handleFinishForm={handleFinishForm}
        newSalonModalOpen={
          newSalonModalOpen &&
          status === "authenticated" &&
          !!userDetails &&
          !userDetails.hasSalon
        }
        newSalonForm={newSalonForm}
        handleCancelNewSalon={handleCancelNewSalon}
      />
      <HomeAppointmentsView
        appointments={allAppointments}
        salonDetails={salonDetails}
        infoModalOpen={infoModalOpen}
        setInfoModalOpen={showInfoModal}
        handleOkInfoModal={handleOkInfoModal}
      />
      <GetContactInfoForm
        addContactInfoForm={addContactInfoForm}
        handleAddContactInfo={handleAddContactInfo}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  let session = await getSession(context);
  let user = null;
  let appointment = null;
  let salon = null;
  let salonsPublic = null;
  appointment = await prisma.appointment.findMany();
  salonsPublic = await prisma.salon.findMany();
  if (!!session) {
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
  return {
    props: {
      userDetails: user || null,
      allAppointments: JSON.parse(JSON.stringify(appointment)) || null,
      salonDetails: salon || null,
      salonInfoPublic: JSON.parse(JSON.stringify(salonsPublic)) || null,
    },
  };
}
