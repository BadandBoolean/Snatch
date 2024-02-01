import prisma from "../../../lib/prisma";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const log = new Logger();
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
    console.log("error in getting all salons", { error: error });
  }
  res.end();
};
