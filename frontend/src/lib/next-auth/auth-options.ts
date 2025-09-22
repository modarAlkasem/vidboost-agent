// /// <reference types="./next-auth.d.ts" />

// import type { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

// import {
//   GOOGLE_CLINET_ID,
//   GOOGLE_CLIENT_SECRET,
//   AUTH_SECRET,
// } from "../constants/auth";

// export const NEXT_AUTH_OPTIONS: AuthOptions = {
//   secret: AUTH_SECRET(),
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     GoogleProvider({
//       clientId: GOOGLE_CLINET_ID(),
//       clientSecret: GOOGLE_CLIENT_SECRET(),
//       async profile(profile) {},
//     }),
//   ],
// };
