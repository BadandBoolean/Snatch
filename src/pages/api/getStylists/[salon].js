import prisma from "../../../../lib/prisma";

export default async (req, res) => {
  console.log("IN THE API");
  console.log(req.query);
  const { salon } = req.query;
  try {
    const stylists = await prisma.stylist.findMany({
      where: { salonId: salon },
    });
    console.log(stylists);
    res.status(200).json({ stylists });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  res.end();
};

// need to find the stylists in a salon with a given salon name
