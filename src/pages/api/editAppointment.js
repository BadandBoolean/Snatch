import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    const bod = req.body;

    const appttime = bod.appttime;
    const apptdate = bod.apptdate;
    const stylist = bod.stylist;
    const servicetype = bod.servicetype;
    const price = bod.price;
    const notes = bod.notes;
    const id = bod.id;
    try {
      const updatedAppt = await prisma.appointment.update({
        where: {
          id: id,
        },
        data: {
          time: appttime,
          date: apptdate,
          whoWith: stylist,
          service: servicetype,
          price: price,
          notes: notes,
          isAvailable: true,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(401);
  }
  res.end();
};
