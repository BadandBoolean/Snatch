// gets the distance of the user from the salon
import prisma from "../../../lib/prisma";
import { Client } from "@googlemaps/google-maps-services-js";
import { Logger } from "next-axiom";

export default async (req, res) => {
  const log = new Logger();
  console.log("in api for getDistFromUser");
  if (req.method === "POST") {
    const googleMapsClient = new Client({});
    const bod = req.body;
    const userZip = bod.userZip;
    const salonLoc = bod.salonLoc;
    try {
      const geocoder = await googleMapsClient.geocode({
        params: {
          address: userZip,
          components: "country:US",
          key: process.env.GOOGLE_API_KEY,
        },
        timeout: 1000, // milliseconds
      });
      const userLocation = geocoder.data.results[0].geometry.location;
      const userLat = userLocation.lat;
      const userLong = userLocation.lng;

      const salonLocationGeocoder = await googleMapsClient.geocode({
        params: {
          address: salonLoc,
          components: "country:US",
          key: process.env.GOOGLE_API_KEY,
        },
        timeout: 1000, // milliseconds
      });
      const salonLocation =
        salonLocationGeocoder.data.results[0].geometry.location;
      const salonLat = salonLocation.lat;
      const salonLong = salonLocation.lng;

      console.log("USERLAT" + userLat);
      console.log("USERLONG" + userLong);
      console.log("SALONLAT" + salonLat);
      console.log("SALONLONG" + salonLong);

      // now we have to calculate the distance between the user and the salon
      // using distancematrix api
      const distanceMatrix = await googleMapsClient.distancematrix({
        params: {
          origins: [`${userLat},${userLong}`],
          destinations: [`${salonLat},${salonLong}`],
          key: process.env.GOOGLE_API_KEY,
        },
        timeout: 1000,
      });
      console.log(distanceMatrix.data);

      //convert distance to miles
      const distanceInMeters =
        distanceMatrix.data.rows[0].elements[0].distance.value;
      console.log(distanceInMeters);
      let distance = distanceInMeters / 1609.344;

      // round distance to 1 decimel point
      distance = Math.round(distance * 100) / 100;
      console.log(distance);

      res.status(200).json({ distance });
    } catch (error) {
      log.error(error);
      res.status(401);
    }
  } else {
    res.status(401);
  }
  res.end();
};
