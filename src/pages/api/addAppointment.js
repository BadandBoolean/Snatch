import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

// appointment is tied to salon, not owner.
export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    // Signed in and want to make a new salon
    const bod = req.body;
    console.log(bod);
    const salonname = bod.salonname;
    const appttime = bod.appttime;
    const apptdate = bod.apptdate;
    const stylist = bod.stylist;
    const servicetype = bod.servicetype;
    const price = bod.price;
    const notes = bod.notes;
    // step 1: make date
    // step 2: parse it to DateTime

    // Update an existing Salon record by creating a new Appointment record
    // we need the where section to be pretty secure.
    try {
      const salon = await prisma.salon.update({
        where: { ownerId: session.user.id },
        data: {
          appointments: {
            create: {
              salonname: salonname,
              date: apptdate,
              time: appttime,
              whoWith: stylist,
              service: servicetype,
              price: price,
              notes: notes,
              isAvailable: true,
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
