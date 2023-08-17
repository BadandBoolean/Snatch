import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

// appointment is tied to salon, not owner.
export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    // Signed in and want to delete an appointment.
    const bod = req.body;
    // console.log(bod);
    const apptid = bod.id;
    try {
      const deleteAppointment = await prisma.appointment.delete({
        where: { id: apptid },
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
