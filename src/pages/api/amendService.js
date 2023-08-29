import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    const bod = req.body;
    const action = bod.action;
    const salonId = bod.salonId;
    const serviceId = bod.serviceId; // might be null, depending on what the action is
    const servicename = bod.service;
    try {
      if (action == "add") {
        const addService = await prisma.salon.update({
          where: { ownerId: session.user.id }, // might need to change this, it is not that obviously the best method
          data: {
            services: {
              create: {
                name: servicename,
              },
            },
          },
        });
      } else if (action == "remove") {
        const removeService = await prisma.service.delete({
          where: { id: serviceId },
        });
      } else if (action == "edit") {
        const editService = await prisma.service.update({
          where: { id: serviceId },
          data: {
            name: servicename,
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
