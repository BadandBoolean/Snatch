// called by cloudflare worker every minute to delete appointment which is older than the current date and time
// delete all appointments where current timestamp is greater than the appointment timestamp
// in the database time is the column we are concerned

// it also deletes appointments from CurrentiCalAppointment table where the current timestamp is greater than the appointment timestamp
import prisma from "../../../lib/prisma";

export default async (req, res) => {
  // get the current datetime in js
  const currentDateTime = new Date();
  const currentTimeStamp = currentDateTime.getTime();
  console.log("current timestamp: ", currentTimeStamp);
  // get all the appointments
  const appointments = await prisma.appointment.findMany();
  // then, for each one, combine the date and time into a single timestamp
  appointments.forEach(async (appointment) => {
    try {
      let date = appointment.date;
      let time = appointment.time;

      // make the date and time into strings
      let dateStr = date.toISOString();
      let timeStr = time.toISOString();

      let datePart = dateStr.split("T")[0];
      console.log("date part: ", datePart);
      // Extracting the time part from the time ISO string
      let timePart = timeStr.split("T")[1]; // In case the time string is already just a time
      console.log("time part: ", timePart);
      let combinedDateTimeStr = `${datePart}T${timePart}`;
      console.log("combined date and time: ", combinedDateTimeStr);
      const dateAndTime = new Date(combinedDateTimeStr);

      console.log("date and time: ", dateAndTime.toISOString());

      const timestamp = dateAndTime.getTime();
      // if the timestamp is less than the current timestamp, delete it
      if (timestamp < currentTimeStamp) {
        await prisma.appointment.delete({
          where: {
            id: appointment.id,
          },
        });
      }
    } catch (error) {
      console.log("error deleting ood appointment: ", error);
    }
  });

  // delete from CurrentiCalAppointment table all appointments where the start time is less than the current time
  const icalAppointments = await prisma.CurrentiCalAppointment.findMany();
  icalAppointments.forEach(async (icalAppointment) => {
    try {
      let startTime = icalAppointment.startTime; // this is a date object in utc
      if (startTime < currentDateTime) {
        await prisma.CurrentiCalAppointment.delete({
          where: {
            iCalApptId: icalAppointment.iCalApptId,
          },
        });
      }
    } catch (error) {
      console.log(
        `error deleting ical appointment with id ${icalAppointment}: ${error} `
      );
    }
  });

  res.end();
};
