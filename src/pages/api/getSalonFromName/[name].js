import prisma from "../../../../lib/prisma";

export default async (req, res) => {
  if (req.method === "GET") {
    const { name } = req.query;
    try {
      const salon = await prisma.salon.findFirst({
        where: { name: name },
      });
      res.status(200).json({ salon });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    res.end();
  }
};
