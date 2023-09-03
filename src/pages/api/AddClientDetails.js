import prisma from "../../../lib/prisma";

// appointment is tied to salon, not owner.
export default async (req, res) => {
  if (req.method === "POST") {
    const bod = req.body;
    // console.log(bod);
    // console.log("IN THE API");
    const phone = bod.phone;
    const email = bod.email;
    const salon = bod.salon;
    try {
      if (phone) {
        const clientphonenum = await prisma.ClientPhoneNumber.create({
          data: {
            clientphone: phone,
            salonId: salon,
          },
        });
      }
      if (email) {
        const clientemailaddr = await prisma.ClientEmailAddress.create({
          data: {
            clientemail: email,
            salonId: salon,
          },
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    // trying to GET here instead of POST
    res.status(401);
  }
  res.end();
};
