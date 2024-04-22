import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

// fuck yeah this works. good job bby
export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    // Signed in and want to make a new salon
    const bod = req.body;
    // console.log(bod);
    const salonId = bod.salonId;
    const salonName = bod.salonname;
    const salonPhone = bod.salonphone;
    const salonEmail = bod.salonaddress;
    const AdditionalBookingInfo = bod.bookingInfo;
    const bookingOptions = bod.bookingOptions;
    let calendarUrl = bod.calendarUrl;

    // format the calendar url correctly! if it is a webcal!
    if (calendarUrl.toLowerCase().startsWith("webcal")) {
      // Use a regular expression with 'i' flag for case-insensitive replacement
      calendarUrl = calendarUrl.replace(/webcal/i, "https");
    }

    try {
      const updateSalon = await prisma.salon.update({
        where: { id: salonId },
        data: {
          name: salonName,
          phone: salonPhone,
          address: salonEmail,
          bookingInfo: AdditionalBookingInfo,
          bookingOptions: bookingOptions,
          calendarUrl: calendarUrl,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    // not signed in or trying to GET here instead of POST
    res.status(401);
  }
  res.end();
};
