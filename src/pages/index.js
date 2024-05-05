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
import { HomeModeContext } from "../../lib/context";

export default function Home({ userDetails, salonDetails }) {
  const { data: session, status } = useSession(); // object, not array
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { homeMode, setHomeMode } = useContext(HomeModeContext);
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
    // redirect to the business home page if business is toggled.
    if (homeMode === "business") {
      router.push("/business");
    }
  }, [homeMode]);

  useEffect(() => {
    setHydrated(true);
    setHomeMode("clients");
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const handleFinishTypeformAndRedirect = async (payload) => {
    console.log("payload: ", payload);
    const fields = payload.fields;
    const response = await fetch("./api/typeFormPostNewStylist", {
      method: "POST",
      body: JSON.stringify({
        firstName: fields[1],
        lastName: fields[2],
        salonName: fields[3],
        website: fields[4],
        phone: fields[5],
        email: fields[6],
        acceptWalkIns: fields[7],
        acceptNewClients: fields[8],
        iCalURL: fields[9],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response: ", response);
    window.location.reload();
    console.log(userDetails);
    if (userDetails.hasSalon) {
      router.push("/OwnerHome");
    }
  };

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

  const openMakeNewStylistModal = () => {
    setNewStylistModalOpen(true);
    // console.log("we are in this modal");
  };

  const handleCancelNewStylist = () => {
    setNewStylistModalOpen(false);
  };

  const handleGoSalonPage = () => {
    setIsRedirecting(true);
    router.push("/OwnerHome");
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
      {status === "authenticated" && (
        <>
          <br />
          <div className={styles.signedInHasSalonDivWrapper}>
            <div className={styles.signedInHasSalonDiv}>
              <div className={styles.buttonBoxMobileOnly}>
                {!!userDetails && !userDetails.hasSalon ? (
                  <Button
                    onClick={openMakeNewStylistModal}
                    className={styles.ownerHomeButton}
                  >
                    {isRedirecting ? (
                      <Spin />
                    ) : (
                      <span className={styles.buttonText}>
                        Register Your Provider Profile
                      </span>
                    )}
                  </Button>
                ) : (
                  <Button
                    className={styles.ownerHomeButton}
                    onClick={handleGoSalonPage}
                  >
                    {isRedirecting ? (
                      <Spin />
                    ) : (
                      <span className={styles.buttonText}>
                        {salonDetails.name} Home Page
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <NewStylistTypeform
        handleFinishTypeformAndRedirect={handleFinishTypeformAndRedirect}
        newStylistModalOpen={
          newStylistModalOpen &&
          status === "authenticated" &&
          !!userDetails &&
          !userDetails.hasSalon
        }
        hiddenUserEmail={!!session ? session.user.email : ""}
        handleCancelNewStylist={handleCancelNewStylist}
      />

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
