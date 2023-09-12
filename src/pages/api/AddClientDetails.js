import prisma from "../../../lib/prisma";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const log = new Logger();
  const twiliosid = process.env.TWILIO_SID;
  const twilioauth = process.env.TWILIO_TOKEN;
  const twilioclient = require("twilio")(twiliosid, twilioauth);
  if (req.method === "POST") {
    const bod = req.body;
    const phone = bod.phone;
    const email = bod.email;
    let salons = bod.salon;
    const numSalons = bod.salon;
    try {
      // if all salons has been selected, get em all
      if (salons === "") {
        salons = await prisma.salon.findMany();
        salons = salons.map((salon) => salon.id);
      } else {
        // add the salons string to a new array
        const temp = salons;
        salons = [];
        salons.push(temp);
      }
      // log.info("salons:", salons);
      console.log("the salons are: ", salons);
      // now go through each salon, and fill in the phone number and email depending on the environment.
      if (process.env.NODE_ENV === "development") {
        console.log(
          "if you can read this and you're in preview you shouldn't be here"
        );
        if (phone) {
          salons.forEach(async (salon) => {
            const updateSalon = await prisma.salon.update({
              where: {
                id: salon,
              },
              data: {
                phoneSubsDev: {
                  push: phone,
                },
              },
            });
          });
        }
        if (email) {
          salons.forEach(async (salon) => {
            const updateSalon = await prisma.salon.update({
              where: {
                id: salon,
              },
              data: {
                emailSubsDev: {
                  push: email,
                },
              },
            });
          });
        }
      } else {
        console.log("if you can read this and you're in preview that is GOOD");
        if (phone) {
          console.log("updaring phone for salons: ", salons);
          console.log("phone is: ", phone);

          await Promise.all(
            salons.map(async (salon) => {
              const updateSalon = await prisma.salon.update({
                where: {
                  id: salon,
                },
                data: {
                  phoneSubsProd: {
                    push: phone,
                  },
                },
              });
              console.log("updateSalon: ", updateSalon);
              console.log("updated for this salon: ", salon);
            })
          );
        }
        if (email) {
          salons.forEach(async (salon) => {
            const updateSalon = await prisma.salon.update({
              where: {
                id: salon,
              },
              data: {
                emailSubsProd: {
                  push: email,
                },
              },
            });
          });
        }
      }

      // now we have to send a text to the user to let them know they have opted in for notifications!
      // ONLY text if the user's phone number is valid (10 digits)
      const regex = /^\d{10}$/;
      if (!regex.test(phone)) {
        console.log(`${phone} is not valid. Not sending text.`);
      } else {
        let messagebod;
        if (numSalons === "") {
          messagebod = `Welcome to Snatch!
        You have opted in to receive notifications!
        \nText STOP to unsubscribe`;
        } else {
          // we need to RETRIEVE the salon name from the salon id.
          const salonName = await prisma.salon.findUnique({
            where: {
              id: numSalons,
            },
            select: {
              name: true,
            },
          });
          console.log("salonName retrieved: ", salonName);
          messagebod = `Welcome to Snatch!
          You have opted in to receive notifications whenever ${salonName} has a last-minute cancellation!
          \nText STOP to unsubscribe`;
        }

        let message = await twilioclient.messages.create({
          body: messagebod,
          to: `+1${phone}`,
          from: `${process.env.TWILIO_NUMBER}`,
        });
        console.log(message.sid);
        console.log(`sent text to ${phone}`);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      log.error(error);
    }
    res.status(200);
  } else {
    log.error("method not allowed in AddClientDetails");
    res.status(405).json({ message: "method not allowed" });
  }
  res.end();
};
