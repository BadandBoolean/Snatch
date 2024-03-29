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
  const [salonsLoading, setSalonsLoading] = useState(true);
  const [salons, setSalons] = useState([]);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const recaptchaRef = useRef();

  useEffect(() => {
    fetch(`./api/getAllSalons`)
      .then((res) => res.json())
      .then((data) => {
        setSalons(data.salons);
        setSalonsLoading(false);
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

  const options = salons.map((salon) => {
    return { value: salon.id, label: salon.name };
  });
  options.unshift({ value: "", label: "All" });

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
                  name="phonenumber"
                >
                  <Input
                    addonBefore="+1"
                    placeholder="Enter your phone number (optional)"
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
                      Select a salon
                    </p>
                  }
                  initialValue={""}
                  name="salonselect"
                >
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Filter by salon"
                    options={!salonsLoading && options}
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
