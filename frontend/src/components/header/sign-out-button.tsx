import React from "react";
import { Button } from "../ui/button";

import { LogOut } from "lucide-react";

const SignOutButton = () => {
  return (
    <Button
      variant="outline"
      className=" w-full flex justify-start items-start  gap-x-6 px-4.5 py-4 bg-transparent hover:bg-[#2D2D4D] border-none hover:cursor-pointer h-12.5"
    >
      <LogOut className="text-gray-200 font-semibold h-full ml-3 mr-2" />
      <span className="text-gray-200 font-semibold text-sm ">Sign Out</span>
    </Button>
  );
};

export default SignOutButton;
