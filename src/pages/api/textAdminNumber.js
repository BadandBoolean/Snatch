import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  const twiliosid = process.env.TWILIO_SID;
  const twilioauth = process.env.TWILIO_TOKEN;
  const twilioclient = require("twilio")(twiliosid, twilioauth);

  if (session) {
    try {
      twilioclient.messages.create({
        body: "Appointment change detected!",
        to: `${process.env.ADMIN_NUMBER}`,
        from: `${process.env.TWILIO_NUMBER}`,
      });
      res.status(200).json({ message: "success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  res.end();
};
