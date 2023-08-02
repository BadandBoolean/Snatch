import prisma from "../../../lib/prisma";

// appointment is tied to salon, not owner.
export default async (req, res) => {
  if (req.method === "POST") {
    const bod = req.body;
    console.log(bod);
    const phone = bod.phone;
    const email = bod.email;
    try {
      if (phone) {
        const clientphonenum = await prisma.ClientPhoneNumber.create({
          data: {
            clientphone: phone,
          },
        });
      }
      if (email) {
        const clientemailaddr = await prisma.ClientEmailAddress.create({
          data: {
            clientemail: email,
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
