import prisma from "../../../../lib/prisma";

export default async (req, res) => {
  if (req.method === "GET") {
    const { appt } = req.query;
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appt },
      });
      const salon = await prisma.salon.findUnique({
        where: { id: appointment.salonId },
      });
      res.status(200).json({ salon });
    } catch (error) {
      res.status(401);
    }
    res.end();
  }
};
