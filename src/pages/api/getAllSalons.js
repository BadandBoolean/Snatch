import prisma from "../../../lib/prisma";

export default async (req, res) => {
  try {
    const salons = await prisma.salon.findMany({
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json({ salons });
  } catch (error) {
    res.status(400).json({ message: error.message });
    log.error("error in getting all salons", { error: error });
  }
  res.end();
};
