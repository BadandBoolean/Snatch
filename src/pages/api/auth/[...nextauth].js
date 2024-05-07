import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { redirect } from "next/dist/server/api-utils";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../../../lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, token, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn(user, account, profile) {
      const findUser = await prisma.registeredPartners.findFirst({
        where: {
          partneremail: user.user.email,
        },
      });
      const isAllowedToSignIn = true; // !!findUser or true; can be changed to allow spontaneous signups
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        // Or you can return a URL to redirect to:
        return "/unauthorizedsignup";
      }
    },
  },
  // todo: better sign in theme.
  theme: {
    colorScheme: "dark",
    brandColor: "#2d19b1",
  },
};

export default NextAuth(authOptions);
