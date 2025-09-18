"use client";

import React from "react";
import Link from "next/link";
import AgentPluse from "./agent-pluse";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";

import { AuthForm } from "./forms/auth-form";

function Header() {
  const signedIn = false;

  return (
    <header className="sticky inset-0 z-50 px-4 md:px-0 xl:px-4 bg-[#121224] backdrop-blur-lg border-b border-blue-600 ">
      <div className="container mx-auto flex justify-between items-center h-16">
        {" "}
        {/** Left Section */}
        <div className=" flex items-center justify-between ">
          <Link href="/" className="flex items-center justify-between gap-x-4">
            <AgentPluse size="md" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              VidBoost Agent
            </h1>
          </Link>
        </div>
        {/** Right Section */}
        <div className=" px-4 md:px-0 xl:px-4 h-16 flex items-center justify-between gap-x-4">
          {signedIn ? (
            <>
              <Link href="/manage-plan">
                <Button
                  variant="outline"
                  className=" border-blue-500 bg-transparent text-blue-500 hover:text-blue-300 hover:border-blue-300 hover:bg-[#121224] hover:cursor-pointer "
                >
                  {" "}
                  Manage Plan
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-blue-500 bg-transparent border-none hover:text-blue-300  hover:bg-transparent"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Dialog>
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
                <AuthForm />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
