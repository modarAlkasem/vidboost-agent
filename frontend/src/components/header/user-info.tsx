"use client";

import type { SessionUser } from "./user-button";
import UserButtonAvatar from "./user-button-avatar";

const UserInfo = ({ user }: { user: SessionUser }) => {
  return (
    <div className=" w-full flex  gap-x-4 px-4.5 py-4 ">
      <div className=" flex justify-center items-center w-10 h-10 border border-blue-600 bg-blue-200 rounded-full ">
        <UserButtonAvatar user={user} />
      </div>
      <div className="flex flex-col gap-y-1">
        {user.name && (
          <span className="font-semibold text-white"> {user.name}</span>
        )}

        <span className="text-sm text-gray-200">{user.email}</span>
      </div>
    </div>
  );
};

export default UserInfo;
