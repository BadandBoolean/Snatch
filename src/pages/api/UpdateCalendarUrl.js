import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    // Signed in and want to make a new salon
    const bod = req.body;

    let calendarUrl = bod.calendarUrl;
    const providerId = bod.providerId;

    // format the calendar url correctly! if it is a webcal!
    if (calendarUrl.toLowerCase().startsWith("webcal")) {
      // Use a regular expression with 'i' flag for case-insensitive replacement
      calendarUrl = calendarUrl.replace(/webcal/i, "https");
    }

    try {
      const updateSalon = await prisma.salon.update({
        where: { id: providerId },
        data: {
          calendarUrl: calendarUrl,
        },
      });
      res.status(200).json({ message: "Success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    // not signed in or trying to GET here instead of POST
    res.status(401);
  }
  res.end();
}
