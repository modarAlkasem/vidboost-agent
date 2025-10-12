import { env } from "next-runtime-env";

export const NEXT_PUBLIC_BASE_API_URL = () => env("NEXT_PUBLIC_BASE_API_URL");
export const NEXT_PUBLIC_WEB_SOCKET_BASE_API_URL = () =>
  process.env.NEXT_PUBLIC_WEB_SOCKET_BASE_API_URL;
