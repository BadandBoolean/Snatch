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
  const apptService = queryData.apptService;
  const apptPrice = queryData.apptPrice;
  const apptStylist = queryData.apptStylist;
  const changeType = queryData.changeType;
  let textSubscribers = null;
  if (session) {
    try {
      // get all subscribers
      if (env === "development") {
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
    // now we have the subscribers. we need to send them a text.
    // need to fix the format of apptDate and apptTime
    apptDate = dayjs(apptDate).format("LL");
    apptTime = dayjs(apptTime).format("h:mm a");
    const textBody = `Someone just canceled their appointment at ${salonName}!\n\nDetails: ${apptDate} at ${apptTime}\nAvailable Stylist: ${apptStylist}\nAvailable Service(s): ${apptService}\nPrice: $${apptPrice}\nVisit https://wearesnatch.vercel.app for booking instructions!\n\nText STOP to unsubscribe.`;
    // now we need to send the text to each subscriber.
    try {
      // quickly validate that the number is a ten digit integer.
      console.log(textSubscribers);
      const regex = /^\d{10}$/;
      textSubscribers = textSubscribers.filter((subscriber) =>
        regex.test(subscriber)
      );
      console.log(textSubscribers);
      textSubscribers.forEach((subscriber) => {
        twilioclient.messages.create({
          body: textBody,
          to: `+1${subscriber}`,
          from: `${process.env.TWILIO_NUMBER}`,
        });
      });
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
