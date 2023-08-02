import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

// fuck yeah this works. good job bby
export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    // Signed in and want to make a new salon
    const bod = req.body;
    console.log(bod);
    const salonName = bod.salonName;
    const salonPhone = bod.salonPhone;
    const salonEmail = bod.salonEmail;
    const bookingInfo = bod.bookingInfo;
    const bookingOptions = bod.bookingOptions;
    // Update an existing User record by creating a new Post record
    // we need the where section to be pretty secure.
    try {
      const user = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          hasSalon: true,
          salon: {
            create: {
              name: salonName,
              phone: salonPhone,
              address: salonEmail,
              bookingInfo: bookingInfo,
              bookingOptions: bookingOptions,
            },
          },
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
