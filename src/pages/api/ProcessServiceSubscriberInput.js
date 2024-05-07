// Get the subscriber phone and email details (when people subscribe to get text notifications from the salon)

import prisma from "../../../lib/prisma";
import { Logger } from "next-axiom";

// CHANGE: AddClientDetails -> ProcessServiceSubscriberInput
// we want to add the phone number to those salons which have that service type in servicetype.

export default async (req, res) => {
  const log = new Logger();
  const twiliosid = process.env.TWILIO_SID;
  const twilioauth = process.env.TWILIO_TOKEN;
  const twilioclient = require("twilio")(twiliosid, twilioauth);
  if (req.method === "POST") {
    const bod = req.body;
    const phone = bod.phone;
    let servicetype = bod.servicetype;

    // log.info("salons:", salons);
    console.log("the servicetype is: ", servicetype);
    // now go through each provider, and fill in the phone number and email depending on the environment.! don't have to do this anymore because! we have! a dev database! and a prod database!
    // updating both dev and prod phone lists now. will refactor later.
    if (phone) {
      console.log(
        "updating phone for providers with this servicetype: ",
        servicetype
      );
      console.log("phone is: ", phone);
      try {
        const updatedProviders = await prisma.salon.updateMany({
          where: {
            servicetype: servicetype,
          },
          data: {
            phoneSubsProd: {
              push: phone,
            },
            phoneSubsDev: {
              push: phone,
            },
          },
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
        log.error("error in processservicesubscriberinout: " + error);
      }
    }
    // now we have to send a text to the user to let them know they have opted in for notifications!
    // ONLY text if the user's phone number is valid (10 digits)
    const regex = /^\d{10}$/;
    if (!regex.test(phone)) {
      console.log(`${phone} is not valid. Not sending text.`);
      res
        .status(200)
        .json({ message: "phone number is not valid, text not sent" });
    } else {
      let messagebod;
      let lowerCaseServiceType = servicetype.toLowerCase();
      // TODO: use GPT to generate a fun text message, random each time, to send to the user.
      messagebod = `Welcome to Snatch!\nYou have opted in to receive notifications for last-minute appointments at cool ${lowerCaseServiceType} businesses near you <3\n\nText STOP to unsubscribe`;

      let message = await twilioclient.messages.create({
        body: messagebod,
        to: `+1${phone}`,
        from: `${process.env.TWILIO_NUMBER}`,
      });
      console.log(message.sid);
      console.log(`sent text to ${phone}`);
    }
    res.status(200);
  } else {
    log.error("method not allowed in ProcessServiceSubscriberInput");
    res.status(405).json({ message: "method not allowed" });
  }
  res.end();
};
