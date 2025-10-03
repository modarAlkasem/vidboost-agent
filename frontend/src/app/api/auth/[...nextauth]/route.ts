import NextAuth from "next-auth";

import { NEXT_AUTH_OPTIONS } from "@/lib/next-auth/auth-options";
import { extractNextAuthRequestMetadata } from "@/lib/utils";
import { signOutFetcher } from "@/lib/api";
import api from "@/lib/axios";

const auth = async (req: any, ctx: any) => {
  return await NextAuth(req, ctx, {
    ...NEXT_AUTH_OPTIONS,
    pages: {
      signIn: "/",
      signOut: "/",
      error: "/",
      newUser: "/",
    },
    events: {
      signIn({ user }) {
        api.interceptors.request.use(
          async (config) => {
            if (user?.access_token) {
              config.headers["Authorization"] = `Bearer ${user.access_token}`;
            }

            return config;
          },
          (err) => Promise.reject(err)
        );
        console.log(user.access_token);
      },
      async signOut({ token }) {
        await signOutFetcher({ refresh_token: token.refresh_token as string });
      },
    },
  });
};

export { auth as GET, auth as POST };
