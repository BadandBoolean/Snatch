import React from "react";
import prisma from "../../../lib/prisma";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const log = new Logger();
  if (req.method === "POST") {
    console.log("POST request to /api/addNewEmailSignUp");
    console.log(req.body);
    const bod = req.body;
    const email = bod.email;
    const name = bod.name;
    const businessname = bod.businessname;

    try {
      const emailSignUp = await prisma.LandingPageSignUpEmails.create({
        data: {
          email: email,
          name: name,
          businessname: businessname ? businessname : "",
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
      log.error(error.message);
    }
  } else {
    res.status(401);
    log.error("womp womp");
  }
  res.end();
};
