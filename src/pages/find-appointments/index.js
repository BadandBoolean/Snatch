import { useSession } from "next-auth/react";

import { useEffect, useState, useContext } from "react";
import { Button } from "antd/lib";
import GetContactInfoForm from "../../components/GetContactInfoForm.js";
import { Form, Spin } from "antd/lib";
import Hero from "../../components/Hero.js";
import styles from "../../styles/PublicHome.module.css";
import About from "../../components/ForHomePage/About.js";
import PartnersPanel from "../../components/PartnersPanel.js";
import Navbar from "../../components/NavBar.js";
import IconsGrid from "../../components/IconsGrid.js";
import Footer from "../../components/Footer.js";
export default function Home({}) {
  const { data: status } = useSession(); // object, not array
  const [addContactInfoForm] = Form.useForm();
  const [hydrated, setHydrated] = useState(false);
  const [contactFormTitle, setContactFormTitle] = useState(
    "Get notified about cool last-minute openings in your area:"
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  // FOR CHILD COMPONENT GETCONTACTINFOFORM.JS
  const handleAddContactInfo = async (values) => {
    if (values.phonenumber) {
      // email address not added to UI - should remove here
      const response = await fetch("./api/ProcessServiceSubscriberInput", {
        method: "POST",
        body: JSON.stringify({
          phone: values.phonenumber,
          servicetype: values.servicetypeselect,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    addContactInfoForm.resetFields();
    setContactFormTitle("Check your texts ✌️");
  };

  return (
    <>
      <Navbar />
      <About />
      <GetContactInfoForm
        addContactInfoForm={addContactInfoForm}
        handleAddContactInfo={handleAddContactInfo}
        contactFormTitle={contactFormTitle}
      />
      {status === "loading" ? (
        <div className={styles.loadingDivWrapper}>
          <Spin size="large" />
        </div>
      ) : (
        <></>
      )}

      <IconsGrid mode={"appointments"} />

      <PartnersPanel />
      <Footer />
    </>
  );
}
