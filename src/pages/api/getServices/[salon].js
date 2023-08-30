import prisma from "../../../../lib/prisma";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const log = new Logger();
  log.info("in getting services API");
  const { salon } = req.query;
  try {
    const services = await prisma.service.findMany({
      where: { salonId: salon },
    });

    res.status(200).json({ services });
  } catch (error) {
    res.status(400).json({ message: error.message });
    log.error("error in getting services API", { error: error });
  }
  res.end();
};
