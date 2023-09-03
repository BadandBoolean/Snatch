import prisma from "../../../../lib/prisma";

export default async (req, res) => {
  if (req.method === "GET") {
    console.log("IN THE API FOR GET APPPT");
    const { salon } = req.query;
    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          salonId: salon,
        },

        orderBy: {
          date: "asc",
        },
      });
      res.status(200).json({ appointments });
    } catch (error) {
      res.status(400).json({ message: error.message });
      log.error(`error in getting appointments for ${salon}`, { error: error });
    }
    res.end();
  }
};
