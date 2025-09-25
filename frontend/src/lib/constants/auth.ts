import { env } from "next-runtime-env";

export const GOOGLE_CLIENT_ID = () => env("GOOGLE_CLIENT_ID");

export const GOOGLE_CLIENT_SECRET = () => env("GOOGLE_CLIENT_SECRET");

export const AUTH_SECRET = () => env("AUTH_SECRET");

export const useSecureCookies =
  process.env.NODE_ENV === "production" &&
  String(process.env.NEXTAUTH_URL).startsWith("https://");

const secureCookiePrefix = useSecureCookies ? "__Secure-" : "";

export const formatSecureCookieName = (name: string) =>
  `${secureCookiePrefix}${name}`;
