"use client";

import * as React from "react";

import type { SessionUser } from "./user-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserButtonAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithRef<typeof Avatar> & { user: SessionUser }
>(({ user, ...props }, ref) => {
  return (
    <Avatar {...props} ref={ref}>
      <AvatarImage src={user.picture} />
      <AvatarFallback className="font-bold bg-transpa hover:rent text-blue-600  hover:text-blue-200">
        {user.name
          ? user.name
              ?.split(" ")
              .map((text) => text[0].toUpperCase())
              .join("")
          : [user?.email[0], user?.email[1]]
              .map((text) => text[0].toUpperCase())
              .join("")}
      </AvatarFallback>
    </Avatar>
  );
});

UserButtonAvatar.displayName = "UserButtonAvatar";

export default UserButtonAvatar;
