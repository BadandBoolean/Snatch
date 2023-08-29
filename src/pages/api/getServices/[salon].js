import prisma from "../../../../lib/prisma";

export default async (req, res) => {
  console.log("IN THE API");
  console.log(req.query);
  const { salon } = req.query;
  try {
    const services = await prisma.service.findMany({
      where: { salonId: salon },
    });
    console.log(services);
    res.status(200).json({ services });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  res.end();
};
