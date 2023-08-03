import { signIn, signOut, useSession, getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import NewSalonForm from "../components/NewSalonForm.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "antd/lib";
import Link from "next/link";
import HomeAppointmentsView from "../components/HomeAppointmentsView.js";
import GetContactInfoForm from "../components/GetContactInfoForm.js";
import { Form } from "antd/lib";

// sign in the user. If authenticated, if Salon does not exist, add Salon TODO: validate this logic.

export default function Home({
  userDetails,
  allAppointments,
  salonDetails,
  salonInfoPublic,
}) {
  const { data: session, status } = useSession(); // object, not array
  const router = useRouter();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [addContactInfoForm] = Form.useForm();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, [userDetails, allAppointments, salonDetails, salonInfoPublic]);
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

  return (
    <>
      {status === "loading" && <h2>Loading ...</h2>}
      {status === "unauthenticated" && (
        <>
          Not signed in <br />
          {console.log(userDetails)}
          <button onClick={() => signIn()}>Sign in</button>
          <pre>{status === "unauthenticated" && "User is not logged in"}</pre>
        </>
      )}
      {status === "authenticated" && (
        <>
          Signed in as {session.user.email}
          <br />
          <button onClick={() => signOut()}>Sign out</button>
          {!userDetails.hasSalon ? (
            <NewSalonForm handleFinishForm={handleFinishForm} />
          ) : (
            <Button>
              <Link href="/OwnerHome">Salon Owner Home</Link>
            </Button>
          )}
        </>
      )}
      <HomeAppointmentsView
        appointments={allAppointments}
        salonDetails={salonDetails}
        bookingModalOpen={bookingModalOpen}
        setBookingModalOpen={showBookingModal}
        handleOkBookingModal={handleOkBookingModal}
      />
      <GetContactInfoForm
        addContactInfoForm={addContactInfoForm}
        handleAddContactInfo={handleAddContactInfo}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
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
      salonInfoPublic: salonsPublic || null,
    },
  };
}
