import prisma from "../../../../lib/prisma";

export default async (req, res) => {
  if (req.method === "GET") {
    const { appt } = req.query;
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appt },
      });
      //stringify the appt
      console.log("THIS IS THE APPOINTMENT" + JSON.stringify(appointment));
      // we have to establish if we have a salon attached to this appointment or not. if not, we just get the website/booking link and phone number of salon.
      // first check if the appointment has a salon attached to it by looking for a salon id.
      console.log("APPT SALON ID " + appointment.salonId);
      if (appointment.salonId) {
        const salon = await prisma.salon.findUnique({
          where: { id: appointment.salonId },
        });
        console.log("THIS IS THE SALON" + JSON.stringify(salon));
        // now we have to get the salon details
        res.status(200).json({ salon });
      } else {
        // this appointment was manually input from admin thereby it does not have a salon attached to it yet
        // so we just need to get the booking options and phone number from the appointment itself
        res.status(200).json({});
      }
    } catch (error) {
      console.log(error);
      res.status(401);
    }
    res.end();
  }
};
