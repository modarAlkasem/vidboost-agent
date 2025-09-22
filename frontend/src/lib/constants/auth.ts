import { env } from "next-runtime-env";

export const GOOGLE_CLINET_ID = () => env("GOOGLE_CLINET_ID");

export const GOOGLE_CLIENT_SECRET = () => env("GOOGLE_CLIENT_SECRET");

export const AUTH_SECRET = () => env("AUTH_SECRET");
