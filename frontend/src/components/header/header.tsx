"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import AgentPulse from "../agent-pulse";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { AuthForm } from "../forms/auth-form";
import UserButton from "./user-button";

function Header() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky inset-0 z-50 px-4 md:px-0 xl:px-4 bg-[#121224] backdrop-blur-lg border-b border-blue-600">
      <div className="container mx-auto flex justify-between items-center h-16">
        {" "}
        {/** Left Section */}
        <div className=" flex items-center justify-between ">
          <Link href="/" className="flex items-center justify-between gap-x-4">
            <AgentPulse size="md" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              VidBoost Agent
            </h1>
          </Link>
        </div>
        {/** Right Section */}
        <div className=" px-4 md:px-0 xl:px-4 h-16 flex items-center justify-between gap-x-4">
          {session ? (
            <>
              <Link href="/manage-plan">
                <Button
                  variant="outline"
                  className=" border-blue-600 bg-transparent text-blue-600 hover:text-blue-300 hover:border-blue-300 hover:bg-[#121224] hover:cursor-pointer "
                >
                  {" "}
                  Manage Plan
                </Button>
              </Link>
              <div className="flex items-center justify-center w-10 h-10 border border-blue-600 bg-blue-200 rounded-full hover:bg-[#121224] hover:cursor-pointer hover:border-blue-200 p-2">
                <UserButton />
              </div>
            </>
          ) : (
            <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-blue-500 bg-transparent border-none hover:text-blue-300  hover:bg-transparent"
                >
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-md bg-gradient-to-r from-[#121224] to-[#2D2D4D] border-blue-600 rounded-xl p-8"
                showCloseButton={false}
              >
                {/* <DialogHeader className="flex flex-col items-center">
                  <DialogTitle className="font-bold">
                    {" "}
                    Create your account
                  </DialogTitle>
                  <DialogDescription>
                    Welcome! Please fill in the details to get started
                  </DialogDescription>
                </DialogHeader> */}
                <AuthForm setIsAuthDialogOpen={setIsAuthDialogOpen} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
