"use client";

import { useState, useEffect, useContext, createContext } from "react";
import { useSession } from "next-auth/react";

type TSignInContext = {
  signedIn: boolean;
  updateSignInStatus: (signedIn: boolean) => void;
};

const SignInContext = createContext<undefined | TSignInContext>(undefined);

export const SignInStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { update, data: session } = useSession();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn || session) {
      const interval = setInterval(() => {
        update();
      }, 5 * 60 * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isSignedIn, session]);

  return (
    <SignInContext.Provider
      value={{
        signedIn: isSignedIn,
        updateSignInStatus: (signedIn) => setIsSignedIn(signedIn),
      }}
    >
      {children}
    </SignInContext.Provider>
  );
};

export const useSignInStatus = () => {
  const context = useContext(SignInContext);
  if (!context)
    throw new Error("useSignIn must be used within SignInStatusProvider");

  return context;
};
