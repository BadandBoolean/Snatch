import prisma from "../../../lib/prisma";

export default async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        date: "asc",
      },
    });
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  res.end();
};
