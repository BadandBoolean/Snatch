import prisma from "../../../../lib/prisma";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const log = new Logger();
  log.info("in getting stylists API");
  const { salon } = req.query;
  try {
    const stylists = await prisma.stylist.findMany({
      where: { salonId: salon },
    });
    console.log(stylists);
    res.status(200).json({ stylists });
  } catch (error) {
    res.status(400).json({ message: error.message });
    log.error("error in getting stylists API", { error: error });
  }
  res.end();
};

// need to find the stylists in a salon with a given salon name
