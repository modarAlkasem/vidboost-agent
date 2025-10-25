import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import { Toaster } from "sonner";
import { NextAuthProvider } from "@/providers/next-auth-provider";
import { QueryProvider } from "@/providers/query-provider";

import { AuthDialogProvider } from "@/contexts/auth-dialog-context";
import { SignInStatusProvider } from "@/contexts/signin-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VidBoost Agent",
  description: "AI-powered Youtube video analysis app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <NextAuthProvider>
            <SignInStatusProvider>
              <AuthDialogProvider>
                <Header />
                <main> {children}</main>
              </AuthDialogProvider>
            </SignInStatusProvider>
          </NextAuthProvider>
        </QueryProvider>

        <Toaster />
      </body>
    </html>
  );
}
