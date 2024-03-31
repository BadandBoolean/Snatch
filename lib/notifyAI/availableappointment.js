// Script for generating text message to clients using OpenAI GPT API to let them know an appointment is available to book
import prisma from "../prisma";
import OpenAI from "openai";

const openai = new OpenAI();

export async function notify(newCancellationsAdded, updatedSalon) {
  // get the realsalon name of the provider.
  const realsalon = getRealSalonName(updatedSalon);

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: `The salon is called ${updatedSalon.name}, ` },
      {},
    ],
    model: "gpt-4-turbo-preview",
  });

  console.log(completion.choices[0]);
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
