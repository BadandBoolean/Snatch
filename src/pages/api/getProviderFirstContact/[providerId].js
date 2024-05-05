// rh

import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("API: getProviderFirstContact");
    const { providerId } = req.query;
    if (!providerId) {
      res.status(400).json({ message: "Missing provider id" });
      res.end();
      return;
    }
    try {
      const provider = await prisma.salon.findUnique({
        where: {
          id: providerId,
        },
      });
      let phone = provider.phone;
      let address = provider.address;

      res.status(200).json({ phone, address });
    } catch (error) {
      res.status(400).json({ message: error.message });
      log.error(`error in getting provider contact for ${providerId}`, {
        error: error,
      });
    }
    res.end();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
