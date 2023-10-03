// add an appointment from admn console
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  const log = new Logger();
  if (session && req.method === "POST") {
    const bod = req.body;
    const salonname = bod.salonname;
    const appttime = bod.appttime;
    const apptdate = bod.apptdate;
    const stylist = bod.stylist;
    const servicetype = bod.servicetype;
    const price = bod.price;
    const notes = bod.notes;
    const location = bod.location;
    const zipcode = bod.zipcode;
    const bookingLink = bod.bookingLink;
    const bookingPhone = bod.bookingPhone;
    try {
      const appt = await prisma.appointment.create({
        data: {
          salonname: salonname,
          date: apptdate,
          time: appttime,
          whoWith: stylist,
          service: servicetype ? servicetype : "",
          price: price,
          notes: notes ? notes : "",
          isAvailable: true,
          location: location,
          zipcode: zipcode,
          bookingLink: bookingLink,
          bookingPhone: bookingPhone,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
      log.error(error.message);
    }
  } else {
    res.status(401);
    log.error("not authorized to add an appointment.");
  }
  res.end();
};
