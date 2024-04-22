import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { Logger } from "next-axiom";
import prisma from "../../../lib/prisma";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");

dayjs.extend(localizedFormat);

// first recieve list of subscribers
// then retrieve query data for which salon to notify for.
// for the subscribers who have all or that salon, notify them. may need to pool/multithread for fairness.
// return ok.

export default async (req, res) => {
  const log = new Logger();
  const session = await getServerSession(req, res, authOptions);
  const twiliosid = process.env.TWILIO_SID;
  const twilioauth = process.env.TWILIO_TOKEN;
  const env = process.env.NODE_ENV;
  const twilioclient = require("twilio")(twiliosid, twilioauth);
  // there are multiple parameters in the query string. we need to get them all.
  const queryData = req.body;
  const salonId = queryData.salonId;
  const salonName = queryData.salonName;
  let apptDate = queryData.apptDate;
  let apptTime = queryData.apptTime;
  const apptPrice = queryData.apptPrice;
  const changeType = queryData.changeType;
  let textSubscribers = null;
  if (session) {
    try {
      // get all subscribers
      if (env === "development") {
        console.log(
          "if you can read this and you're in preview/production you shouldn't be here"
        );
        textSubscribers = await prisma.salon.findUnique({
          where: {
            id: salonId,
          },
          select: {
            phoneSubsDev: true,
          },
        });
        textSubscribers = textSubscribers.phoneSubsDev;
      } else {
        console.log("you SHOULD be here (production or preview logs");
        textSubscribers = await prisma.salon.findUnique({
          where: {
            id: salonId,
          },
          select: {
            phoneSubsProd: true,
          },
        });
        textSubscribers = textSubscribers.phoneSubsProd;
      }
    } catch (error) {
      log.error(error);
      res.status(400).json({ message: error.message });
    }

    // get the list of all subscribers
    const allSubscribers = await prisma.AllSalonsPhoneNums.findMany({
      select: {
        phonenum: true,
      },
    });

    // add the subscribers to the list of subscribers
    textSubscribers = textSubscribers.concat(
      allSubscribers.map((subscriber) => subscriber.phonenum)
    );

    console.log("textSubscribers: ", textSubscribers);

    apptDate = dayjs(apptDate).format("LL");
    console.log(apptTime);

    const textBody = `Someone just canceled their appointment with ${salonName}!\n\nDetails: ${apptDate} at ${apptTime}\nVisit https://wearesnatch.com for booking instructions!\n\nText STOP to unsubscribe.`;
    // now we need to send the text to each subscriber.
    try {
      // quickly validate that the number is a ten digit integer.
      console.log(textSubscribers);
      const regex = /^\d{10}$/;
      textSubscribers = textSubscribers.filter((subscriber) =>
        regex.test(subscriber)
      );
      console.log(textSubscribers);

      await Promise.all(
        textSubscribers.map(async (subscriber) => {
          let message = await twilioclient.messages.create({
            body: textBody,
            to: `+1${subscriber}`,
            from: `${process.env.TWILIO_NUMBER}`,
          });
          console.log(message.sid);
          console.log(`sent text to ${subscriber}`);
        })
      );
    } catch (error) {
      log.error(error);
      res.status(400).json({ message: error.message });
    }
    res.status(200).json({ message: "ok" });
  } else {
    log.error("Unauthorized");
    res.status(401);
  }
  res.end();
};
