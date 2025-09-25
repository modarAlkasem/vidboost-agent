"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";

const SignOutButton = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const onButtonClick = async () => {
    try {
      setIsSigningOut(true);
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });
      setIsSigningOut(false);
    } catch (err) {
      toast.error("An unknown error occured", {
        description:
          "We encountered an error while trying to sign you out. please try again later.",
        duration: 5000,
        position: "top-right",
      });
    }
  };
  return (
    <Button
      variant="outline"
      className=" w-full flex justify-start items-start  gap-x-6 px-4.5 py-4 bg-transparent hover:bg-[#2D2D4D] border-none hover:cursor-pointer h-12.5"
      disabled={isSigningOut}
      onClick={onButtonClick}
    >
      <LogOut className="text-gray-200 font-semibold h-full ml-3 mr-2" />
      <span className="text-gray-200 font-semibold text-sm ">Sign Out</span>
    </Button>
  );
};

export default SignOutButton;
