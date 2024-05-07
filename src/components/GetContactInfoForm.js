import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Select } from "antd/lib";
import styles from "../styles/ContactForm.module.css";

export default function GetContactInfoForm({
  addContactInfoForm,
  handleAddContactInfo,
  contactFormTitle,
}) {
  const [providersLoading, setProvidersLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [serviceTypesLoading, setServiceTypesLoading] = useState(true);
  const [serviceTypes, setServiceTypes] = useState([]);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const recaptchaRef = useRef();

  useEffect(() => {
    fetch(`./api/getAllSalons`)
      .then((res) => res.json())
      .then((data) => {
        setProviders(data.salons);
        setProvidersLoading(false);
      });
  }, []);

  // retrieve all the service types to give users the option to subscribe to receive updates from one kind of service provider
  useEffect(() => {
    fetch(`./api/getAllServiceTypes`)
      .then((res) => res.json())
      .then((data) => {
        setServiceTypes(data.serviceTypes);
        setServiceTypesLoading(false);
      });
  }, []);

  const handleCaptchaSubmission = async (token) => {
    if (!token) {
      setIsCaptchaValid(false);
      return;
    }
    try {
      const response = await fetch("/api/validNewContact", {
        method: "POST",
        body: JSON.stringify({ captcha: token }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // If the response is ok than show the success alert
        setIsCaptchaValid(true);
      } else {
        // Else throw an error with the message returned
        // from the API
        console.log("CAPTCHA " + isCaptchaValid);
        const error = await response.json();

        console.log("CAPTCHA " + isCaptchaValid);
        throw new Error(error.message);
      }
    } catch (error) {
      alert(error?.message || "Something went wrong");
      console.log(isCaptchaValid);
    } finally {
      // Reset the reCAPTCHA when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      console.log("you are not a robot");
      console.log(isCaptchaValid);
    }
  };

  // const provideroptions = providers.map((provider) => {
  //   return { value: provider.id, label: provider.name };
  // });
  // // add an option to subscribe to ALL providers (should deprecate!)
  // provideroptions.unshift({ value: "", label: "All" });

  const servicetypeoptions = serviceTypes.map((serviceType) => {
    return { value: serviceType.servicetype, label: serviceType.servicetype };
  });

  return (
    <>
      <div className={styles.contactWrapper}>
        <div className={styles.contactOuterDiv}>
          <div className={styles.contactMiddleDiv}>
            <div className={styles.contactDiv}>
              <h3 className={styles.infoText}>{contactFormTitle}</h3>

              <Form
                form={addContactInfoForm}
                onFinish={handleAddContactInfo}
                className={styles.contactForm}
              >
                <Form.Item
                  label={
                    <p
                      style={{
                        fontSize: "16px",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      Phone Number
                    </p>
                  }
                  rules={[
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Please input only numbers! e.g 9173249214",
                    },
                  ]}
                  name="phonenumber"
                >
                  <Input
                    addonBefore="+1"
                    placeholder="Enter your phone number"
                    maxLength={15}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <p
                      style={{
                        fontSize: "16px",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      Select a Service:
                    </p>
                  }
                  initialValue={serviceTypes[0]?.servicetype}
                  name="servicetypeselect"
                >
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    options={!serviceTypesLoading && servicetypeoptions}
                  />
                </Form.Item>
                <Form.Item>
                  <ReCAPTCHA
                    sitekey={siteKey}
                    onChange={handleCaptchaSubmission}
                  />
                </Form.Item>
                {!!isCaptchaValid && (
                  <Form.Item>
                    <Button
                      // disable button is the captcha has not been completed or is invalid

                      style={{
                        backgroundColor: "rgba(102, 79, 253, 0.8)",
                        color: "white",
                        border: "2px solid white",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      htmlType="submit"
                    >
                      <b>Submit</b>
                    </Button>
                  </Form.Item>
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
