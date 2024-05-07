import prisma from "../../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("API: getApptsByService");
    const { serviceType } = req.query;
    if (!serviceType) {
      res.status(400).json({ message: "Missing service type" });
      res.end();
      return;
    }
    try {
      if (serviceType === "All") {
        const appointments = await prisma.appointment.findMany({});
        res.status(200).json({ appointments });
      } else {
        const appointments = await prisma.appointment.findMany({
          where: {
            servicetype: serviceType,
          },
        });
        res.status(200).json({ appointments });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
      log.error(`error in getting appointments for ${serviceType}`, {
        error: error,
      });
    }
    res.end();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
