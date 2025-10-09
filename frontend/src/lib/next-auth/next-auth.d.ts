import type { AuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    name: string | null;
    email: string;
    email_verified: bolean;

    last_signed_in: string;
    disabled: boolean;
    picture: string | null;
    access_token: string;
    refresh_token: string;
  }

  interface Session {
    user: Omit<User, "id", "access_token" | "refresh_token"> & {
      id: number | string;
    };
    accessToken: string;
    refreshToken: string;
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number | string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    lastSignedIn: string;
    accessToken: string;
    refreshToken: string;
    expires: string;
  }
}
