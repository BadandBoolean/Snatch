// Script for generating text message to clients using OpenAI GPT API to let them know an appointment is available to book
import prisma from "../prisma";
import OpenAI from "openai";
import { Logger } from "next-axiom";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
const log = new Logger();
const env = process.env.NODE_ENV;
const openai = new OpenAI();


// updatedSalon is actually updated PROVIDER since switching to the provider model. 
export async function notify(newCancellationsAdded, updatedSalon) {
  // get the realsalon name of the provider.
  const realsalon = getRealSalonName(updatedSalon);

  // generate a text message for EACH new appointment opening. we may need to do a promise here. 
  await Promise.all(newCancellationsAdded.map(async (appointment) => {
    const textMessage = await generateTextMessage(appointment, updatedSalon, realsalon);
    // get the subscribers to notify
    // CHANGE THIS!
    const subscribers = await getSubscribersForEnv(updatedSalon);
    // send the text message to the subscribers
    await sendTextMessage(subscribers, textMessage);
  }



}

// get the subscribers for the 
const getSubscribersForEnv = async (salon) => {
    let textSubscribers = [];
    if (env === "")





    return textSubscribers;
}

const generateTextMessage = async (appointment, updatedSalon, realsalon) => {
    const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: `The salon is called ${realsalon.salonname}, the provider is called ${updatedSalon.name}. The service type of this business is ${updatedSalon.servicetype}. Please use this information to construct a text message to clients of this provider to let them know an 
          an appointment may have just become available with them. Do not write anything else except this composed text message. The prompt from the user will give you more details. Keep it friendly and conversational. We don't know the subscribers' names so please don't put in a [client] placeholder into the text message! ` },
          { role: "user", content: `Compose a text message to my client, to let them know that somebody may have just canceled their appointment and I may have availabiity at 
          ${appointment.time} on ${appointment.date}. Tell them to call me to confirm. ` },
        ],
        model: "gpt-4-turbo-preview",
        temperature: 0.7,
      });
       
      console.log(completion.choices[0]);
      return completion.choices[0].message.content;
    }

const getRealSalonName = async (salon) => {
  try {
    const realSalon = await prisma.RealSalon.findUnique({
      where: {
        id: salon.realSalonId,
      },
    });
  } catch (err) {
    console.error("error in getrealsalonname in notify: ", err);
  }
  return realSalon;
};

// this is the flow of events:
// 1. cancelled appointment get sent here
// the structure of information is the following:
// {
// salonname: salon.name, // since salon is the provider, this is actually the providers name, so we need to get the actual salon name too
//       date: appt.startTime,
//       time: appt.startTime,
//       duration: appt.duration,
//       icalApptId: appt.iCalApptId,
//       price: "Call to confirm",
//       notes: "",
//       salon: {
//         connect: { id: salon.id },
// there is also the provider information, for which you can find the subscribers to be notified.
