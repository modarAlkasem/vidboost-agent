/// <reference types="./next-auth.d.ts" />

import type { AuthOptions, User, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { signInFetcher } from "../api";
import { ErrorCode } from "./error-codes";

import {
  GOOGLE_CLINET_ID,
  GOOGLE_CLIENT_SECRET,
  AUTH_SECRET,
  formatSecureCookieName,
  useSecureCookies,
} from "../constants/auth";
import { extractNextAuthRequestMetadata } from "../utils";
import { JWT } from "next-auth/jwt";

export const NEXT_AUTH_OPTIONS: AuthOptions = {
  secret: AUTH_SECRET(),
  session: {
    strategy: "jwt",
  },
  providers: [
    // GoogleProvider({
    //   clientId: GOOGLE_CLINET_ID(),
    //   clientSecret: GOOGLE_CLIENT_SECRET(),
    //   async profile(profile) {},
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Your Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your Password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error(ErrorCode.CREDENTIALS_NOT_FOUND);
        }

        const { email, password } = credentials;
        const { ipAddress, userAgent } = extractNextAuthRequestMetadata(req);
        const user = await signInFetcher({
          email,
          password,
          ip_address: ipAddress,
          user_agent: userAgent,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          email_verified: user.email_verified,
          last_signed_in: user.last_signed_in as string,
          disabled: user.disabled,
          access_token: user.tokens.access_token,
          refresh_token: user.tokens.refresh_token,
          picture: user.picture,
        } satisfies User;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, account, trigger }) {
      return {
        ...token,
        ...user,
      } satisfies JWT;
    },

    session({ session, token }) {
      if (token && token.email) {
        return {
          ...session,
          user: {
            id: token.id,
            name: token.name,
            email: token.email,
            picture: token.picture,
          },
          accessToken: token.accessToken,
        } satisfies Session;
      }
      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: formatSecureCookieName("next-auth.session-token"),
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? "none" : "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: formatSecureCookieName("next-auth.callback-url"),
      options: {
        sameSite: useSecureCookies ? "none" : "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      // Default to __Host- for CSRF token for additional protection if using useSecureCookies
      // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
      name: formatSecureCookieName("next-auth.csrf-token"),
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? "none" : "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
    pkceCodeVerifier: {
      name: formatSecureCookieName("next-auth.pkce.code_verifier"),
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? "none" : "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
};
