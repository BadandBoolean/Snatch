// API for finding the appointments in a given radius to a user's location

import prisma from "../../../lib/prisma";
import { Client } from "@googlemaps/google-maps-services-js";

export default async (req, res) => {
  console.log("IN API FOR FIND FILTERED APPTS");
  if (req.method === "POST") {
    const googleMapsClient = new Client({});

    const bod = req.body;
    const userZip = bod.userZip;
    const searchRadius = bod.searchRadius;

    try {
      // first, let's convert the user's zip code to lat and long
      // use googles client instead
      const geocoder = await googleMapsClient.geocode({
        params: {
          address: userZip,
          components: "country:US",
          key: process.env.GOOGLE_API_KEY,
        },
        timeout: 1000, // milliseconds
      });

      console.log(
        "GEOCODER DATA " +
          JSON.stringify(geocoder.data.results[0].geometry.location)
      );

      const userLocation = geocoder.data.results[0].geometry.location;
      const userLat = userLocation.lat;
      const userLong = userLocation.lng;
      console.log("USERLAT" + userLat);
      console.log("USERLONG" + userLong);
      // now let's get all the appointments
      const appointments = await prisma.appointment.findMany({});
      // now let's filter out the ones that are too far away, but first we have to convert their location + zipcode to lat and long
      const filteredAppointments = [];
      for (const appointment of appointments) {
        // combine the zipcode and location fields into one string
        const locationQueryString = `${appointment.location} ${appointment.zipcode}`;
        const salonLocationGeocoder = await googleMapsClient.geocode({
          params: {
            address: locationQueryString,
            components: "country:US",
            key: process.env.GOOGLE_API_KEY,
          },
          timeout: 1000, // milliseconds
        });

        console.log(
          "SALON LOCATION GEOCODER DATA " +
            JSON.stringify(
              salonLocationGeocoder.data.results[0].geometry.location
            )
        );

        const salonLocation =
          salonLocationGeocoder.data.results[0].geometry.location;

        const salonLat = salonLocation.lat;
        const salonLong = salonLocation.lng;
        const distance = getDistanceFromLatLonInKm(
          userLat,
          userLong,
          salonLat,
          salonLong
        );
        // convert km to miles

        const distanceInMiles = distance * 0.621371;

        console.log("DISTANCE IN MILES " + distanceInMiles);
        console.log("SEARCH RADIUS " + searchRadius);
        if (distanceInMiles < searchRadius) {
          filteredAppointments.push(appointment);
        }
      }
      // now return only the appointments within the radius in the json response
      res.status(200).json({ filteredAppointments });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(401);
  }
  res.end();
};

// this function is from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
// it calculates the distance between two lat/long points in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
