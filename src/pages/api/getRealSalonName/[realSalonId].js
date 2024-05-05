import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("API: getRealSalonName");
    const { realSalonId } = req.query;
    if (!realSalonId) {
      res.status(400).json({ message: "Missing real salon id" });
      res.end();
      return;
    }
    try {
      const realSalon = await prisma.RealSalon.findUnique({
        where: {
          id: realSalonId,
        },
      });
      let realSalonName = realSalon.salonname;
      res.status(200).json({ realSalonName });
    } catch (error) {
      res.status(400).json({ message: error.message });
      log.error(`error in getting real salon name for ${realSalonId}`, {
        error: error,
      });
    }
    res.end();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
