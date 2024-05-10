import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("API: getProvidersByServiceType");
    const { serviceType } = req.query;
    if (!serviceType) {
      res.status(400).json({ message: "Missing service type" });
      res.end();
      return;
    }
    try {
      if (serviceType === "All") {
        const providers = await prisma.salon.findMany({});
        res.status(200).json({ providers });
      } else {
        const providers = await prisma.salon.findMany({
          where: {
            servicetype: serviceType,
          },
        });
        res.status(200).json({ providers });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
      log.error(`error in getting providers for ${serviceType}`, {
        error: error,
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
