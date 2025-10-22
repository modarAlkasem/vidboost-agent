"use client";

import { useContext, createContext, useState } from "react";

export const AuthFormContextChoices = {
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP",
} as const;

export type AuthContext = keyof typeof AuthFormContextChoices;

interface AuthDialogType {
  showDialog: boolean;
  authContext: AuthContext;
  setAuthContext: (authContext: AuthContext) => void;
  setShowDialog: (dialogOpenState: boolean) => void;
}

const AuthDialogContext = createContext<AuthDialogType | undefined>(undefined);

export const AuthDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showDialog, setshowDialog] = useState(false);
  const [authContext, setAuthContext] = useState<AuthContext>(
    AuthFormContextChoices.SIGN_IN
  );
  return (
    <AuthDialogContext.Provider
      value={{
        showDialog: showDialog,
        authContext: authContext,
        setAuthContext: (authContextParam) => setAuthContext(authContextParam),

        setShowDialog: (showDialogState) => setshowDialog(showDialogState),
      }}
    >
      {" "}
      {children}{" "}
    </AuthDialogContext.Provider>
  );
};

export const useAuthDialog = () => {
  const context = useContext(AuthDialogContext);

  if (!context) {
    throw new Error("useAuthDialog must be used within AuthDialogProvider");
  }

  return context;
};
