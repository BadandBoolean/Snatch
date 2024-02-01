import verifyTFSignature from "../../../lib/verifyTFSignature";
import prisma from "../../../lib/prisma";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const log = new Logger();
  if (req.method === "POST") {
    // verify the typeform signature
    const signature = req.headers["typeform-signature"];
    const isValid = verifyTFSignature(
      signature,
      `${JSON.stringify(req.body)}\u000a`
    );
    if (!isValid) {
      res.status(401).send("Invalid signature! Access Denied :)");
      log.info("Invalid signature! Access Denied :)");

      return;
    }
    // if the signature is valid, we can proceed
    try {
      log.info("success! signature is valid");

      // EDIT: HAVE TO HANDLE OPTIONAL FIELDS! (like address, phone, email)
      // first retrieve all the sections that you need from the body of the response.
      const bod = req.body;
      const responses = bod.form_response.answers;
      log.info("bod", bod);
      // check the ref of each possible answer
      const useremail = bod.form_response.hidden.useremail;

      const firstnameResponse = responses.find(
        (answer) => answer.field.ref === "firstname"
      );
      const lastnameResponse = responses.find(
        (answer) => answer.field.ref === "lastname"
      );
      const salonnameResponse = responses.find(
        (answer) => answer.field.ref === "salonname"
      );
      const addressResponse = responses.find(
        (answer) => answer.field.ref === "address"
      );
      const phoneResponse = responses.find(
        (answer) => answer.field.ref === "phone"
      );
      const emailResponse = responses.find(
        (answer) => answer.field.ref === "email"
      );
      const calendarUrlResponse = responses.find(
        (answer) => answer.field.ref === "calendarurl"
      );
      const allowWalkInsResponse = responses.find(
        (answer) => answer.field.ref === "allowwalkins"
      );
      const acceptNewClientsResponse = responses.find(
        (answer) => answer.field.ref === "acceptnewclients"
      );

      const fullName = `${firstnameResponse.text} ${lastnameResponse.text}`; // this is the name of the stylist, these fields are required
      const salonName = salonnameResponse.choice.label; // this is the name of the salon, this field is required
      const address = addressResponse ? addressResponse.url : ""; // this is the address of the salon, this field is optional
      const phone = phoneResponse ? phoneResponse.phone_number : ""; // this is the phone of the salon, this field is optional
      const email = emailResponse ? emailResponse.email : ""; // this is the email of the salon, this field is optional
      const calendarUrl = calendarUrlResponse ? calendarUrlResponse.url : ""; // this is the calendar url of the salon, this field is optional
      const allowWalkIns = allowWalkInsResponse
        ? allowWalkInsResponse.boolean
        : true; // this is the allow walk ins of the salon, this field is optional
      const acceptNewClients = acceptNewClientsResponse
        ? acceptNewClientsResponse.boolean
        : true; // this is the accept new clients of the salon, this field is optional

      // now we get to work! Make a new Salon (really provider)
      // notes:
      // salonName pertains to salonname of RealSalon
      const user = await prisma.user.update({
        where: { email: useremail },
        data: {
          hasSalon: true, // SALON PERSONA
          salon: {
            create: {
              name: fullName,
              address: address,
              phone: phone,
              email: email,
              calendarUrl: calendarUrl,
              allowWalkIns: allowWalkIns,
              acceptNewClients: acceptNewClients,
            },
          },
        },
      });
      // if the salonName is found in the database of RealSalons, then we connect the two.
      // the realsalon has a stylists field which is just Salon[]
      // the relationship of Salon to RealSalon is many to one
      // if not, skip this step
      const salon = await prisma.RealSalon.findUnique({
        where: {
          salonname: salonName,
        },
      });
      if (salon) {
        const updatedRealSalon = await prisma.RealSalon.update({
          where: {
            salonname: salonName,
          },
          data: {
            stylists: {
              connect: {
                id: user.salon.id, // we are connecting a stylist persona aka the 'salon'
              },
            },
          },
        });
        log.info("updatedRealSalon: ", updatedRealSalon);
      }
      res.status(200).send("Success! New stylist added.");
      log.info("Success! New stylist added.");
      log.info("user: ", user);
      log.info("salon: ", salon);
    } catch (error) {
      console.log("Error in typeFormPostNewStylist: ", error);
      log.error("Error in typeFormPostNewStylist: ", error);
      res.status(500).send("Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
    log.info("Method Not Allowed");
  }
  res.end();
};

// LOOK at me look at me
// 1. DONE finish creating the typeform for new stylist using the model as a guide.
// 2. DONE finish this api route page including changing the database user content for this specific user
// 3. 'looks like your salon is not in our database. please add it here.'
// 4. edit salon page change to match the model (delete stylist field)
// 5. edit add appointmet and structure of ediitng an appointment to note the changes.
