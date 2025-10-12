/// <reference types="./next-auth.d.ts" />

import type { AuthOptions, User, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { GoogleProfile } from "next-auth/providers/google";
import { DateTime } from "luxon";

import { signInFetcher, signInSocialFetcher } from "../api";
import { ErrorCode } from "./error-codes";

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  AUTH_SECRET,
  formatSecureCookieName,
  useSecureCookies,
} from "../constants/auth";
import { extractNextAuthRequestMetadata } from "../utils";
import { JWT } from "next-auth/jwt";
import api from "../axios";

export const NEXT_AUTH_OPTIONS: AuthOptions = {
  secret: AUTH_SECRET(),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider<GoogleProfile>({
      clientId: GOOGLE_CLIENT_ID() ?? "",
      clientSecret: GOOGLE_CLIENT_SECRET() ?? "",
      async profile(profile, tokens) {
        const data = {
          email: profile.email,
          id_token: tokens.id_token ?? "",
          access_token: tokens.access_token ?? "",
          provider: "google" as const,
        };

        const result = await signInSocialFetcher(data);

        return {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          email_verified: result.user.email_verified,
          last_signed_in: result.user.last_signed_in as string,
          disabled: result.user.disabled,
          access_token: result.tokens.access_token,
          refresh_token: result.tokens.refresh_token,
          picture: result.user.picture,
        } satisfies User;
      },
    }),
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
        try {
          const result = await signInFetcher({
            email,
            password,
            ip_address: ipAddress,
            user_agent: userAgent,
          });

          return {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            email_verified: result.user.email_verified,
            last_signed_in: result.user.last_signed_in as string,
            disabled: result.user.disabled,
            access_token: result.tokens.access_token,
            refresh_token: result.tokens.refresh_token,
            picture: result.user.picture,
          } satisfies User;
        } catch (err: any) {
          throw new Error(err.status_text);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      let resultToken = { ...token };
      if (user) {
        resultToken = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.email_verified,
          lastSignedIn: user.last_signed_in,

          accessToken: user.access_token,
          refreshToken: user.refresh_token,
          expires: DateTime.now().toUTC().plus({ minutes: 5 }).toISO(),
        } satisfies JWT;
      }

      if (
        DateTime.fromISO(token.expires) >=
        DateTime.now().toUTC().plus({ minutes: 5 })
      ) {
        const result = await api.post("/auth/token/refresh/", {
          refresh: token.refreshToken,
        });

        token.accessToken = result.data.access_token;
        token.refreshToken = result.data.refresh_token;
        token.expires = DateTime.now().toUTC().toISO();
      }

      return resultToken satisfies JWT;
    },

    session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          name: token.name,
          email: token.email,
          picture: token.picture,
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expires: token.expires,
      } satisfies Session;
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
