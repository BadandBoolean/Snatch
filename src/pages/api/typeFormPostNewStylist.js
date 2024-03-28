import prisma from "../../../lib/prisma";
import { Logger } from "next-axiom";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { LastMonthInstance } from "twilio/lib/rest/api/v2010/account/usage/record/lastMonth";

export default async (req, res) => {
  const log = new Logger();
  const session = await getServerSession(req, res, authOptions);
  if (session && req.method === "POST") {
    const bod = req.body;
    console.log("bod", bod);
    // what is the type?
    console.log("type of bod", typeof bod);
    // these are objects!!! remember that when you are posting them with prisma
    const firstName = bod.firstName;
    const lastName = bod.lastName;
    const salonName = bod.salonName;
    const website = bod.website;
    const phone = bod.phone;
    const email = bod.email;
    const acceptWalkIns = bod.acceptWalkIns.answer.value == "Yes";
    const acceptNewClients = bod.acceptNewClients.answer.value == "Yes";
    const iCalURL = bod.iCalURL;

    // Update an existing User record by creating a new Post record
    // we need the where section to be pretty secure.
    try {
      const user = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          hasSalon: true,
          salon: {
            create: {
              name: `${firstName.answer.value} ${lastName.answer.value}`,
              phone: phone.answer.value ? phone.answer.value : "",
              email: email.answer.value ? email.answer.value : "",
              address: website.answer.value ? website.answer.value : "",
              allowWalkIns: acceptWalkIns,
              acceptNewClients: acceptNewClients,
              calendarUrl: iCalURL.answer.value, // default is empty string
              hasRealSalon:
                salonName.answer.value == "None of the above" ? false : true,
              // we connect the salon to the user later.
            },
          },
        },
      });
      log.info("user profile updated: ", user);
      // if the salonName is found in the database of RealSalons, then we connect the two.
      if (salonName.answer.value != "None of the above") {
        const realsalon = await prisma.RealSalon.findFirst({
          where: {
            salonname: salonName.answer.value,
          },
        });
        log.info("realsalon found!: ", realsalon);
        // if a real salon has been located
        if (realsalon) {
          // now we have locate Salon (the stylist profile) that we just added to the user above.
          const stylist = await prisma.Salon.findFirst({
            where: {
              ownerId: user.id,
            },
          });
          log.info("Salon (but really stylist) found!: ", stylist);
          const updatedRealSalon = await prisma.RealSalon.update({
            where: {
              id: realsalon.id,
            },
            data: {
              stylists: {
                connect: {
                  id: stylist.id, // we are connecting a stylist persona aka the 'salon'
                },
              },
            },
          });
          log.info("updatedRealSalon: ", updatedRealSalon);
        }
      }
    } catch (error) {
      log.error("Error in typeFormPostNewStylist: ", error);
      res.status(500).send("Error");
    }
  } else {
    // not signed in or trying to GET here instead of POST
    res.status(401);
  }
  res.end();
};

// LOOK AT ME:

// bugs to fix:

// what to do next:
// 1. "looks like you dont have a salon" type of thing
// 2. change up the edit/add appointment buttons.
