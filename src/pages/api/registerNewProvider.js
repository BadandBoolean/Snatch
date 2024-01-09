import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

// registers new provider with details provided by the typeform.
// might try to use graphQL on client side to send these queries? 
export default async (req,res) => {
    const session = await getServerSession(req, res, authOptions);
    if (session && req.method === "POST") {
        const bod = req.body;
        const firstname = bod.firstname;
        const lastname = bod.lastname;
        const salonname = bod.salonname; // if you're salon is registered with us already, you will link it already (in prisma studio we can make this link manually)
        const phonenumber = bod.phonenumber;
        const bookinglink = bod.bookinglink;
        const website = bod.website;
        const physaddress = bod.physaddress;
        // these are retrieved from typeform 
        try {
            const provider = await.prisma.update({
                
            })
        }

    }
}