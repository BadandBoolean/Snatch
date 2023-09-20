import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { Logger } from "next-axiom";

// text a customer from a custom page just designed for ME. Phase out after the prototype phase.
export default async (req, res) => {
  const log = new Logger();
  const session = await getServerSession(req, res, authOptions);
  const twiliosid = process.env.TWILIO_SID;
  const twilioauth = process.env.TWILIO_TOKEN;
  const env = process.env.NODE_ENV;
  const twilioclient = require("twilio")(twiliosid, twilioauth);

  const queryData = req.body;
  const textBody = queryData.textBody;
  const textNumber = queryData.textNumber;

  if (session) {
    try {
      let message = await twilioclient.messages.create({
        body: textBody,
        to: `+1${textNumber}`,
        from: `${process.env.TWILIO_NUMBER}`,
      });
      console.log(message.sid);
      console.log(`sent text to ${textNumber}`);
      res.status(200).json({ message: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error" });
    }
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
  res.end();
};
