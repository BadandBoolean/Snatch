import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    const bod = req.body;
    const action = bod.action;
    const salonId = bod.salonId;
    const stylistId = bod.stylistId; // might be null, depending on what the action is
    const stylistname = bod.stylist;
    try {
      if (action == "add") {
        const addStylist = await prisma.salon.update({
          where: { ownerId: session.user.id }, // might need to change this, it is not that obviously the best method
          data: {
            stylists: {
              create: {
                name: stylistname,
              },
            },
          },
        });
      } else if (action == "remove") {
        const removeStylist = await prisma.stylist.delete({
          where: { id: stylistId },
        });
      } else if (action == "edit") {
        const editStylist = await prisma.stylist.update({
          where: { id: stylistId },
          data: {
            name: stylistname,
          },
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(401);
  }
  res.end();
};
