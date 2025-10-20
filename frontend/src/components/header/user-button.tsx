"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import UserInfo from "./user-info";
import { Session } from "next-auth";
import UserButtonAvatar from "./user-button-avatar";
import SignOutButton from "./sign-out-button";

export type SessionUser = Session["user"];
const UserButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const user = session?.user as SessionUser;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <UserButtonAvatar user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mt-[15px] w-[378px] bg-[#121224] hover:bg-[#121224] shadow-[0_0_10px_6px_rgba(37,99,235,0.5)] border-none p-0 "
      >
        <DropdownMenuItem className="p-0 focus:bg-transparent ">
          {" "}
          <UserInfo user={user} />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-blue-600 my-0" />
        <DropdownMenuItem className="p-0 focus:bg-transparent">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
