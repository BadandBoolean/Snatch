import prisma from "../../../lib/prisma";
import { Logger } from "next-axiom";

// get all service types, return a list of UNIQUE service types - this is not a great method but here we are.
export default async function handler(req, res) {
  const log = new Logger();
  try {
    const serviceTypes = await prisma.Salon.findMany({
      select: {
        servicetype: true,
      },
      distinct: ["servicetype"],
    });
    res.status(200).json({ serviceTypes });
  } catch (error) {
    res.status(400).json({ message: error.message });
    log.error("error in getting all service types", { error: error });
    console.log("error in getting all service types", { error: error });
  }
}
