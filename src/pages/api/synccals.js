// Job which is called by cron to sync the calendar if the user has an ical url in place

import ical from "node-ical";
import prisma from "../../../lib/prisma";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

export default async (req, res) => {
  try {
    // check each salon (now synon. with providers) for non-null calendar url. If it exists, get that salon
    const salonsWithiCals = await GetSalonsWithiCals();
    // the icalarray for each salon is salonswithicals[i].curriCalApptIds
    // for each salon..
    // make sure that in this loop all async calls are waited for

    const salonPromises = salonsWithiCals.map(async (salon) => {
      const newWebEvents = await GetNewWebEvents(salon.calendarUrl);
      // there are 2 cases we need to handle one by one.
      // 0. NON-CASE: Event exists in both. No change, do nothing.
      // 1. Unique Event exists in NewWebEvents but not in CurriCalApptIds: customer booked new appointment, need to add to our records (in array AND shared currentapptsdb)
      // 2. Unique Event exists in CurriCalApptIds but not in NewWebEvents: customer cancelled appointment, need to remove from our records (in array AND shared currentapptsdb) AND ADD TO APPOINTMENT TABLE FOR SHOWING! AND ALERT CUSTOMERS!
      // what if both cases exist????

      // retrieve appointment ids from web events
      let webEventIds = await GetEventIdsFromWebEvents(newWebEvents);
      // compare webEventIds to salon.curriCalApptIds
      // Case 1: webevents, !curriCalApptIds
      const newAppointmentsMade = webEventIds.filter(
        (id) => !salon.curriCalApptIds.includes(id)
      );
      // Case 2: curriCalApptIds, !webEventIds
      const appointmentsCancelled = salon.curriCalApptIds.filter(
        (id) => !webEventIds.includes(id)
      );
      let updatedSalon;
      // handle new appointments made
      if (newAppointmentsMade.length > 0) {
        updatedSalon = await HandleAddNewAppointments(
          newAppointmentsMade,
          salon,
          newWebEvents
        );
        console.log("AddedNewAppointments: ", updatedSalon);
      } else {
        console.log("No new appointments from ical");
        updatedSalon = salon;
      }
      // handle appointments cancelled
      let updatedSalonWithCancels;
      console.log(
        `appointmentsCancelled for ${salon.name}: ${appointmentsCancelled}`
      );
      if (appointmentsCancelled.length > 0) {
        updatedSalonWithCancels = await HandleAddCancelledAppointments(
          appointmentsCancelled,
          updatedSalon // this is the updated salon AFTER NEW ICAL APPTS HAVE BEEN ADDED
        );
        console.log("AddedCancelledAppointments: ", updatedSalonWithCancels);
      } else {
        console.log("No cancelled appointments");
        updatedSalonWithCancels = updatedSalon;
      }
      // finally: check that there are no appointments in Appointment which start at the same time as an appointment in CurrentiCalAppointment FOR THE SAME PROVIDER
      // if there are, delete them from Appointment
      //   let clashingAppointments = await HandleDeleteClashingAppointments(salon);
      //   console.log("clashingAppointments: ", clashingAppointments);
    });
    await Promise.all(salonPromises);

    res.end();
  } catch (error) {
    console.log("SyncCals Top Level Error Caught:", error);
    res.status(500).send("Error");
  }
};

const GetSalonsWithiCals = async () => {
  try {
    const salonsWithiCals = await prisma.salon.findMany({
      where: {
        calendarUrl: {
          not: "",
        },
      },
    });
    return salonsWithiCals;
  } catch (error) {
    console.log("GetSalonsWithiCals Error:", error);
    throw error;
  }
};

const GetNewWebEvents = async (calendarUrl) => {
  try {
    const webEvents = await ical.async.fromURL(calendarUrl);
    return webEvents;
  } catch (error) {
    console.log("GetCurrentWebEvents Error:", error);
    throw error;
  }
};

const GetEventIdsFromWebEvents = async (newWebEvents) => {
  try {
    let webEventIds = [];
    for (let k in newWebEvents) {
      if (newWebEvents.hasOwnProperty(k)) {
        var ev = newWebEvents[k];
        if (ev.type == "VEVENT") {
          webEventIds.push(ev.uid);
        }
      }
    }
    return webEventIds;
  } catch (error) {
    console.log("GetEventIdsFromWebEvents Error:", error);
    throw error;
  }
};

const HandleAddCancelledAppointments = async (appointmentsCancelled, salon) => {
  try {
    // 1. remove from salon.curriCalApptIds
    // 2. add to Appointment table for showing
    // 3. remove from currenicalappointments
    // 4. alert customers via text!

    // 1. Update the array of appt ids to not include the cancelled appointments
    // a. get current string array.
    let curriCalApptIds = salon.curriCalApptIds;
    // b. remove cancelled appointments
    curriCalApptIds = curriCalApptIds.filter(
      (id) => !appointmentsCancelled.includes(id)
    );
    // c. update salon.curriCalApptIds
    const updatedSalon = await prisma.salon.update({
      where: {
        id: salon.id,
      },
      data: {
        curriCalApptIds: curriCalApptIds,
      },
    });
    console.log("updatedSalon: ", updatedSalon);

    // 2. add to Appointment table for showing, but you need the details of that appointment from currentIcalAppointments
    // for each appt id, get the details for start time and duration from currenticalappointments
    // a. fetch appts to transfer:
    const appointmentsToTransfer = await prisma.CurrentiCalAppointment.findMany(
      {
        where: {
          iCalApptId: {
            in: appointmentsCancelled,
          },
        },
      }
    );

    const creationPromises = appointmentsToTransfer.map(async (appt) => {
      // b. create appointment in appointment table
      // need to convert the startTime string which is currently in UTC to two separate fields: date and time both of which are in local time

      const createdappt = await prisma.appointment.create({
        data: {
          salonname: salon.name,
          date: appt.startTime,
          time: appt.startTime,
          duration: appt.duration,
          icalApptId: appt.iCalApptId,
          price: "Call to confirm",
          notes: "",
          salon: {
            connect: { id: salon.id },
          },
        },
      });
      console.log("createdappt: ", createdappt);
    });

    // c. wait for all promises to resolve
    await Promise.all(creationPromises);

    // 3. remove all of these currenticalappointments which have an id in appointmentsCancelled
    const deletedAppointments = await prisma.CurrentiCalAppointment.deleteMany({
      where: {
        iCalApptId: {
          in: appointmentsCancelled,
        },
      },
    });
    // 4. alert customers via text! ... if there are appointments to alert about.
    if (appointmentsToTransfer.length > 0) {
      console.log("updatedSalon: ", updatedSalon);
      const alertedcustomers = await textSubscribers(
        appointmentsToTransfer,
        updatedSalon
      );
      console.log("alertedcustomers: ", alertedcustomers);
    }

    return updatedSalon;
  } catch (error) {
    console.log("HandleAddCancelledAppointments Error:", error);
    throw error;
  }
};

const textSubscribers = async (appointmentsToTransfer, salon) => {
  try {
    const twiliosid = process.env.TWILIO_SID;
    const twilioauth = process.env.TWILIO_TOKEN;
    const env = process.env.NODE_ENV;
    const twilioclient = require("twilio")(twiliosid, twilioauth);

    let textSubscribers = null;
    if (env === "development") {
      console.log(
        "if you can read this in preview/production you shouldn't be here"
      );
      console.log("salon: ", salon);
      textSubscribers = await prisma.salon.findUnique({
        where: {
          id: salon.id,
        },
        select: {
          phoneSubsDev: true,
        },
      });
      textSubscribers = textSubscribers.phoneSubsDev;

      // ONLY FOR PRODUCTION
      // // get the list of all subscribers
      // const allSubscribers = await prisma.AllSalonsPhoneNums.findMany({
      //   select: {
      //     phonenum: true,
      //   },
      // });

      // // add the subscribers to the list of subscribers
      // // add the subscribers to the list of subscribers
      // textSubscribers = textSubscribers.concat(
      //   allSubscribers.map((subscriber) => subscriber.phonenum)
      // );

      console.log("textSubscribers in synccals, dev: ", textSubscribers);
      let phoneSentence;
      let websiteSentence;
      let realSalonName;
      let realSalonSentence;
      let nocontactmessage;

      if (salon.phone) {
        phoneSentence =
          `Call ${salon.phone} to book` + (salon.address ? `` : `.\n`);
      }
      if (salon.address) {
        websiteSentence =
          (salon.phone ? ` or g` : `G`) +
          `rab this spot before it's gone at ${salon.address}.\n`;
      }
      if (salon.realSalonId) {
        realSalonName = await prisma.RealSalon.findUnique({
          where: {
            id: salon.realSalonId,
          },
          select: {
            salonname: true,
          },
        });
        console.log("realSalonName: ", realSalonName);
        realSalonSentence = `at ${realSalonName.salonname}`;
      }
      if (!salon.phone && !salon.address) {
        nocontactmessage = `Grab it before somebody else does. `;
      }

      // for now, we are going to alert the subscribers with one message for each appointment
      for (let appt in appointmentsToTransfer) {
        const apptTime = dayjs(appointmentsToTransfer[appt].startTime).format(
          "LT"
        );
        const apptDate = dayjs(appointmentsToTransfer[appt].startTime).format(
          "LL"
        );

        const messageBody =
          `Hey there! 🌟 Exciting news: ${salon.name} ` +
          (salon.realSalonId ? realSalonSentence : ``) +
          ` now has an opening on ${apptDate} at ${apptTime}! ` +
          (salon.phone ? phoneSentence : ``) +
          (salon.address ? websiteSentence : ``) +
          (nocontactmessage ? nocontactmessage : ``) +
          `We're stoked to see you soon!✨\n\n - ${salon.name}` +
          (salon.realSalonId
            ? ` and the team at ${realSalonName.salonname}`
            : ``) +
          `\n\nBrought to you by Snatch ❤️‍🔥 \n(Text STOP to unsubscribe.)`;

        console.log("messageBody: ", messageBody);
        // send the message
        // quickly validate the phone numbers
        const regex = /^\d{10}$/;
        textSubscribers = textSubscribers.filter((subscriber) =>
          regex.test(subscriber)
        );
        console.log("textSubscribers after validation: ", textSubscribers);
        // send the message
        await Promise.all(
          textSubscribers.map(async (subscriber) => {
            let message = await twilioclient.messages.create({
              body: messageBody,
              to: `+1${subscriber}`,
              from: `${process.env.TWILIO_NUMBER}`,
            });
            console.log(message.sid);
            console.log(`sent text to ${subscriber}`);
          })
        );
      }
    } else {
      console.log("hello production!");
      console.log("salon: ", salon);
      textSubscribers = await prisma.salon.findUnique({
        where: {
          id: salon.id,
        },
        select: {
          phoneSubsProd: true,
        },
      });
      textSubscribers = textSubscribers.phoneSubsProd;

      // ONLY FOR PRODUCTION
      // get the list of all subscribers
      const allSubscribers = await prisma.AllSalonsPhoneNums.findMany({
        select: {
          phonenum: true,
        },
      });

      // add the subscribers to the list of subscribers
      // add the subscribers to the list of subscribers
      textSubscribers = textSubscribers.concat(
        allSubscribers.map((subscriber) => subscriber.phonenum)
      );

      console.log("textSubscribers in synccals, prod: ", textSubscribers);
      let phoneSentence;
      let websiteSentence;
      let realSalonName;
      let realSalonSentence;
      let nocontactmessage;

      if (salon.phone) {
        phoneSentence =
          `Call ${salon.phone} to book` + (salon.address ? `` : `.\n`);
      }
      if (salon.address) {
        websiteSentence =
          (salon.phone ? ` or g` : `G`) +
          `rab this spot before it's gone at ${salon.address}.\n`;
      }
      if (salon.realSalonId) {
        realSalonName = await prisma.RealSalon.findUnique({
          where: {
            id: salon.realSalonId,
          },
          select: {
            salonname: true,
          },
        });
        console.log("realSalonName: ", realSalonName);
        realSalonSentence = `at ${realSalonName.salonname}`;
      }
      if (!salon.phone && !salon.address) {
        nocontactmessage = `Grab it before somebody else does. `;
      }

      // for now, we are going to alert the subscribers with one message for each appointment
      for (let appt in appointmentsToTransfer) {
        const apptTime = dayjs(appointmentsToTransfer[appt].startTime).format(
          "LT"
        );
        const apptDate = dayjs(appointmentsToTransfer[appt].startTime).format(
          "LL"
        );

        const messageBody =
          `Hey there! 🌟 Exciting news: ${salon.name} ` +
          (salon.realSalonId ? realSalonSentence : ``) +
          ` now has an opening on ${apptDate} at ${apptTime}! ` +
          (salon.phone ? phoneSentence : ``) +
          (salon.address ? websiteSentence : ``) +
          (nocontactmessage ? nocontactmessage : ``) +
          `We're stoked to see you soon!✨\n\n - ${salon.name}` +
          (salon.realSalonId
            ? ` and the team at ${realSalonName.salonname}`
            : ``) +
          `\n\nBrought to you by Snatch ❤️‍🔥 \n(Text STOP to unsubscribe.)`;

        console.log("messageBody: ", messageBody);
        // send the message
        // quickly validate the phone numbers
        const regex = /^\d{10}$/;
        textSubscribers = textSubscribers.filter((subscriber) =>
          regex.test(subscriber)
        );
        console.log("textSubscribers after validation: ", textSubscribers);
        // send the message
        await Promise.all(
          textSubscribers.map(async (subscriber) => {
            let message = await twilioclient.messages.create({
              body: messageBody,
              to: `+1${subscriber}`,
              from: `${process.env.TWILIO_NUMBER}`,
            });
            console.log(message.sid);
            console.log(`sent text to ${subscriber}`);
          })
        );
      }
    }
  } catch (error) {
    console.log("textSubscribers Error:", error);
    throw error;
  }
};

const HandleAddNewAppointments = async (
  newAppointmentsMade,
  salon,
  newWebEvents
) => {
  try {
    // for each new appointment (NOT the same as cancelled appointments)
    // 1. add to salon.curriCalApptIds
    // 2. add to current

    // 1.
    // a. get current string array.
    let curriCalApptIds = salon.curriCalApptIds;
    // b. combine with new appointments made
    curriCalApptIds = curriCalApptIds.concat(newAppointmentsMade);
    // c. update salon.curriCalApptIds
    const updatedSalon = await prisma.salon.update({
      where: {
        id: salon.id,
      },
      data: {
        curriCalApptIds: curriCalApptIds,
      },
    });

    // 2.
    // a. find events in newwebevents with ids in newappointmentsmade, get their start and ends
    let promises = [];
    for (let k in newWebEvents) {
      if (newWebEvents.hasOwnProperty(k)) {
        var ev = newWebEvents[k];
        if (ev.type == "VEVENT") {
          if (newAppointmentsMade.includes(ev.uid)) {
            // b. add to current
            let promise = prisma.CurrentiCalAppointment.create({
              data: {
                iCalApptId: ev.uid,
                startTime: ev.start,
                duration: new Date(ev.end) - new Date(ev.start),
                providerId: salon.id,
              },
            });
            promises.push(promise);
          }
        }
      }
    }
    await Promise.all(promises);

    return updatedSalon;
  } catch (error) {
    console.log("HandleAddNewAppointments Error:", error);
    throw error;
  }
};

// const HandleDeleteClashingAppointments = async (salon) => {
//   try {
//     // Fetch appointments from CurrentiCalAppointment for this salon
//     const currentiCalAppointments =
//       await prisma.currentiCalAppointment.findMany({
//         where: { providerId: salon.id },
//       });

//     // For each appointment, check for clashes in the Appointment model
//     const deletePromises = currentiCalAppointments.map(async (icalAppt) => {
//       // Extract date and time from icalAppt.startTime
//       const icalDate = icalAppt.startTime.toISOString().split("T")[0];
//       const icalTime = icalAppt.startTime
//         .toISOString()
//         .split("T")[1]
//         .substring(0, 8); // HH:mm:ss

//       // Find matching appointments in Appointment model
//       const matchingAppointments = await prisma.appointment.findMany({
//         where: {
//           AND: [
//             {
//               salonId: salon.id,
//               date: {
//                 gte: new Date(`${icalDate}T00:00:00`),
//                 lte: new Date(`${icalDate}T23:59:59`),
//               },
//             },
//             {
//               time: {
//                 gte: new Date(`1970-01-01T${icalTime}`),
//                 lte: new Date(`1970-01-01T${icalTime}`),
//               },
//             },
//           ],
//         },
//       });

//       // Delete matching appointments
//       return Promise.all(
//         matchingAppointments.map((appt) =>
//           prisma.appointment.delete({ where: { id: appt.id } })
//         )
//       );
//     });

//     // Await all delete operations
//     const results = await Promise.all(deletePromises);

//     return results.flat();
//   } catch (error) {
//     console.log("HandleDeleteClashingAppointments Error:", error);
//     throw error;
//   }
// };
