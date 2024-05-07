import { useSession, getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { Button } from "antd/lib";
import GetContactInfoForm from "../components/GetContactInfoForm.js";
import { Form, Spin } from "antd/lib";
import Hero from "../components/Hero";
import styles from "../styles/PublicHome.module.css";
import About from "../components/ForHomePage/About";
import PartnersPanel from "../components/PartnersPanel";
import NewStylistTypeform from "../components/NewStylistTypeform";
import ServiceIcons from "../components/ForHomePage/ServiceIcons";

export default function Home({ userDetails, salonDetails }) {
  const { data: session, status } = useSession(); // object, not array
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [addContactInfoForm] = Form.useForm();
  const [hydrated, setHydrated] = useState(false);
  const [newSalonModalOpen, setNewSalonModalOpen] = useState(true);
  const [newStylistModalOpen, setNewStylistModalOpen] = useState(false);
  const [contactFormTitle, setContactFormTitle] = useState(
    "Get notified about last-minute appointments:"
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const handleAddContactInfo = async (values) => {
    if (values.phonenumber || values.emailaddress) {
      const response = await fetch("./api/AddClientDetails", {
        method: "POST",
        body: JSON.stringify({
          phone: values.phonenumber,
          email: values.emailaddress,
          salon: values.salonselect,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    addContactInfoForm.resetFields();
    setContactFormTitle(
      "Thank you! You will be notified when somebody cancels their appointment!"
    );
  };

  return (
    <>
      <img
        src="/ggreal3.png"
        alt="welcometosnatch"
        className={styles.greekgod}
      />
      <Hero />
      {status === "loading" ? (
        <div className={styles.loadingDivWrapper}>
          <Spin size="large" />
        </div>
      ) : (
        <></>
      )}

      <ServiceIcons />

      <About />

      <PartnersPanel />

      <GetContactInfoForm
        addContactInfoForm={addContactInfoForm}
        handleAddContactInfo={handleAddContactInfo}
        contactFormTitle={contactFormTitle}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  let session = await getSession(context);
  let user = null;
  let salon = null;
  if (!!session) {
    // console.log(appointment);
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
      salonDetails: salon || null,
    },
  };
}
