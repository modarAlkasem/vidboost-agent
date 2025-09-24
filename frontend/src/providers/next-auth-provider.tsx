"use client";

import React from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type NextAuthProps = {
  session?: Session | null;
  children: React.ReactNode;
};

export const NextAuthProvider = ({ session, children }: NextAuthProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
