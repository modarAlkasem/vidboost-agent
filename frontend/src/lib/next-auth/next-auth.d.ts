import type { AuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    name: string | null;
    email: string;
    email_verified: bolean;
    password: string | null;
    last_signed_in: string;
    disabled: boolean;
    access_token: string;
    refresh_token: string;
  }

  interface Session {
    user: Omit<User, "access_token" | "refresh_token">;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    lastSignedIn: string;
    accessToken: string;
    refreshToken: string;
  }
}
