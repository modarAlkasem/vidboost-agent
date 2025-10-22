import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/?open-auth-dialog=true&auth-context=SIGN_IN",
    },
  }
);

export const config = {
  matcher: "/videos/:path*",
};
