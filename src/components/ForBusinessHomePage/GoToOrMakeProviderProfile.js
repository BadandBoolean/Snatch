import React from "react";
import { Button, Spin } from "antd/lib";
import { useState } from "react";
import NewStylistTypeform from "../NewStylistTypeform";
import { useRouter } from "next/router";
import ownerhomestyles from "../../styles/OwnerHome.module.css";

export default function GoToOrMakeProviderProfile({
  session,
  status,
  userDetails,
  providerDetails,
}) {
  const [newStylistModalOpen, setNewStylistModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

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

  return (
    <>
      <div>
        {status === "authenticated" && (
          <>
            {!!userDetails && !userDetails.hasSalon ? (
              <Button onClick={openMakeNewStylistModal}>
                {isRedirecting ? (
                  <Spin />
                ) : (
                  <span>Register Your Provider Profile</span>
                )}
              </Button>
            ) : (
              <Button onClick={handleGoSalonPage}>
                {isRedirecting ? (
                  <Spin />
                ) : (
                  <span>{providerDetails.name} Home Page</span>
                )}
              </Button>
            )}
          </>
        )}
      </div>
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
    </>
  );
}
