import NextAuth from "next-auth";

import { NEXT_AUTH_OPTIONS } from "@/lib/next-auth/auth-options";
import { extractNextAuthRequestMetadata } from "@/lib/utils";

const auth = async (req: any, ctx: any) => {
  return await NextAuth(req, ctx, {
    pages: {
      signIn: "/",
      signOut: "/",
      error: "/",
      newUser: "/",
    },
    ...NEXT_AUTH_OPTIONS,
  });
};

export { auth as GET, auth as POST };
