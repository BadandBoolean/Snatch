import { useSession, getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import NewSalonForm from "../components/NewSalonForm.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "antd/lib";
import HomeAppointmentsView from "../components/HomeAppointmentsView.js";
import GetContactInfoForm from "../components/GetContactInfoForm.js";
import { Form, Spin } from "antd/lib";
import Hero from "../components/Hero";
import styles from "../styles/PublicHome.module.css";
import PickSalon from "../components/PickSalon.js";
import DevelopmentAlert from "../components/DevelopmentAlert";
import About from "../components/About";
import FilterByLocation from "../components/FilterByLocation";
import salonselectstyles from "../styles/salonselect.module.css";
import PartnersPanel from "../components/PartnersPanel";

export default function Home({ userDetails, salonDetails }) {
  const { data: session, status } = useSession(); // object, not array
  const router = useRouter();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [addContactInfoForm] = Form.useForm();
  const [hydrated, setHydrated] = useState(false);
  const [newSalonModalOpen, setNewSalonModalOpen] = useState(true);
  const [newSalonForm] = Form.useForm();
  const [contactFormTitle, setContactFormTitle] = useState(
    "Get notified about last-minute appointments:"
  );
  const [isFilteringByDist, setIsFilteringByDist] = useState(false);
  const [userZip, setUserZip] = useState("");
  const [searchRadius, setSearchRadius] = useState(0); // if it is 0, then we are not filtering by distance.
  const [isRedirecting, setIsRedirecting] = useState(false);
  // the showingSalonId determines which salon's appointments should be shown on the screen.
  const [showingSalonId, setShowingSalonId] = useState("");

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const handleFinishForm = async (values) => {
    // console.log(session);
    // console.log(userDetails);

    if (!!session && !!userDetails) {
      // console.log("session and user exist");
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
    // console.log("we are in this modal");
  };

  const handleCancelNewSalon = () => {
    setNewSalonModalOpen(false);
  };

  const handleGoSalonPage = () => {
    setIsRedirecting(true);
    router.push("/OwnerHome");
  };

  const handleFilterLocation = async (values) => {
    console.log(isFilteringByDist);
    setIsFilteringByDist(true); // this should trigger the picksalon field to default to allsalons which is more of a UI thing.
    console.log(isFilteringByDist);
    console.log(values);
    console.log(isFilteringByDist);
    setUserZip(values.zipcode);
    setSearchRadius(values.radius);
  };

  return (
    <>
      {!session && <DevelopmentAlert />}
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
                    onClick={openMakeNewSalonModal}
                    className={styles.ownerHomeButton}
                  >
                    {isRedirecting ? (
                      <Spin />
                    ) : (
                      <span className={styles.buttonText}>
                        Register your Salon
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
      <div className={salonselectstyles.divWrapper}>
        <div className={salonselectstyles.placementDiv}>
          <FilterByLocation
            isFilteringByDist={isFilteringByDist}
            handleFilterLocation={handleFilterLocation}
          />
          <PickSalon
            isFilteringByDist={isFilteringByDist}
            setIsFilteringByDist={setIsFilteringByDist}
            setShowingSalonId={setShowingSalonId}
          />
        </div>
      </div>
      <HomeAppointmentsView
        salonDetails={salonDetails}
        infoModalOpen={infoModalOpen}
        setInfoModalOpen={showInfoModal}
        handleOkInfoModal={handleOkInfoModal}
        salonId={showingSalonId}
        isFilteringByDist={isFilteringByDist}
        userZip={userZip}
        searchRadius={searchRadius}
      />
      <hr style={{ color: "#2D19B1", width: "90%", marginBottom: "20px" }} />
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
