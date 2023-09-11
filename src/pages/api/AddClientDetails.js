import prisma from "../../../lib/prisma";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const log = new Logger();
  if (req.method === "POST") {
    const bod = req.body;
    const phone = bod.phone;
    const email = bod.email;
    let salons = bod.salon;
    try {
      // if all salons has been selected, get em all
      if (salons === "") {
        salons = await prisma.salon.findMany();
        salons = salons.map((salon) => salon.id);
      } else {
        // add the salons string to a new array
        const temp = salons;
        salons = [];
        salons.push(temp);
      }
      // log.info("salons:", salons);
      console.log("the salons are: ", salons);
      // now go through each salon, and fill in the phone number and email depending on the environment.
      if (process.env.NODE_ENV === "development") {
        console.log(
          "if you can read this and you're in preview you shouldn't be here"
        );
        if (phone) {
          salons.forEach(async (salon) => {
            const updateSalon = await prisma.salon.update({
              where: {
                id: salon,
              },
              data: {
                phoneSubsDev: {
                  push: phone,
                },
              },
            });
          });
        }
        if (email) {
          salons.forEach(async (salon) => {
            const updateSalon = await prisma.salon.update({
              where: {
                id: salon,
              },
              data: {
                emailSubsDev: {
                  push: email,
                },
              },
            });
          });
        }
      } else {
        console.log("if you can read this and you're in preview that is GOOD");
        if (phone) {
          console.log("updaring phone for salons: ", salons);
          console.log("phone is: ", phone);
          salons.forEach(async (salon) => {
            const updateSalon = await prisma.salon.update({
              where: {
                id: salon,
              },
              data: {
                phoneSubsProd: {
                  push: phone,
                },
              },
            });
          });
        }
        if (email) {
          salons.forEach(async (salon) => {
            const updateSalon = await prisma.salon.update({
              where: {
                id: salon,
              },
              data: {
                emailSubsProd: {
                  push: email,
                },
              },
            });
          });
        }
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      log.error(error);
    }
    res.status(200);
  } else {
    log.error("method not allowed in AddClientDetails");
    res.status(405).json({ message: "method not allowed" });
  }
  res.end();
};
