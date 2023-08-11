import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { redirect } from "next/dist/server/api-utils";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  },
  // todo: better sign in theme.
  theme: {
    colorScheme: "dark",
    brandColor: "#2d19b1",
  },
};

export default NextAuth(authOptions);

// async function refreshAccessToken(token) {
//   try {
//     const res = await fetch(
//       `${process.env.DJANGO_AUTH_BASE_URL}/api/token/refresh/`,
//       {
//         method: "POST",
//         body: JSON.stringify({ refresh: token.refresh }),
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//     const refreshedToken = await res.json();

//     if (res.status !== 200) throw refreshedToken;

//     const { exp } = jwtDecode(refreshedToken.access); // check

//     return {
//       ...token,
//       ...refreshedToken,
//       exp,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

// export const authOptions = {
//   session: { strategy: "jwt" }, // this means that the session will be stored in a JWT token..?
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. 'Sign in with...')
//       name: "Django Rest Framework", // change later
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "jsmith" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // You need to provide your own logic here that takes the credentials
//         // submitted and returns either a object representing a user or value
//         // that is false/null if the credentials are invalid.
//         // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
//         // You can also use the `req` object to obtain additional parameters
//         // (i.e., the request IP address)
//         try {
//           const res = await fetch(
//             `${process.env.DJANGO_AUTH_BASE_URL}/api/token/`,
//             {
//               method: "POST",
//               body: JSON.stringify(credentials),
//               headers: { "Content-Type": "application/json" },
//             }
//           );
//           const token = await res.json();
//           if (res.status !== 200) throw token;

//           const { username, email, user_id, exp, is_superuser, is_staff } =
//             jwtDecode(token.access);

//           return {
//             ...token,
//             exp,
//             user: {
//               username,
//               email,
//               user_id,
//               is_staff,
//               is_superuser,
//             },
//           };
//         } catch (error) {
//           console.log(error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       return url.startsWith(baseUrl)
//         ? Promise.resolve(url)
//         : Promise.resolve(baseUrl);
//     },
//     async jwt(token, user, account) {
//       // initial sign in
//       if (user && account) {
//         return user;
//       }

//       // Return previous token if the access token has not expired
//       if (Date.now() < token.exp * 100) {
//         return token;
//       }

//       // refresh token
//       return await refreshAccessToken(token);
//     },
//     async session({ session, token }) {
//       session.access = token.access;
//       session.exp = token.exp;
//       session.refresh = token.refresh;
//       session.user = token.user;
//       return session;
//     },
//   },
// };

// ----

// // todo: refactor with typescript
// const settings = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn(user) {
//       if (user.account.provider === "google") {
//         // extract these two tokens
//         const { access_token, id_token } = user.account;
//         // console.log("\nuser:" + JSON.stringify());
//         console.log("\naccessToken" + access_token + "\nidToken:" + id_token);
//         try {
//           // make a POST request to the django rest framework API
//           const response = await axios.post(
//             // todo: separate file for endpoints
//             "http://127.0.0.1:8000/api/social/login/google/",
//             {
//               id_token: id_token,
//               access_token: access_token,
//             }
//           );

//           // extract the returnd token from the DRF backend, and add it to the user object
//           const { accessToken } = response.data;
//           user.accessToken = accessToken; // NEW OBJECT! is it possible to make in this way?

//           return true;
//         } catch (error) {
//           console.log(error);
//           return false;
//         }
//       }

//       return false;
//     },

//     async jwt(token, user, account, profile, isNewUser) {
//       if (user) {
//         const { accessToken } = user;
//         // reform the token object from the access token we appended to the user object
//         token.accessToken = accessToken;
//       }
//       return token;
//     },
//     async session(session, user) {
//       session.accessToken = user.accessToken;
//       return session;
//     },
//   },
// };
