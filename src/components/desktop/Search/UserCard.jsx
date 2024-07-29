import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user, closeDrawer }) => {
    const nav = useNavigate()

    const onClick = () => {
      if (closeDrawer()) {
        closeDrawer()
      }
      nav(`/${user.username}`)
    }

  return (
    <div className="w-full my-2 flex flex-row items-center gap-4 cursor-pointer" onClick={onClick}>
      <div className="w-16 h-16 flex align-middle justify-center items-center">
        <img
          src={user.userImage}
          alt={`${user.username}'s profile`}
          className="rounded-full"
          style={{ width: "44px", height: "44px" }}
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-white font-bold text-lg">{user.username}</h1>
        <p className="text-gray-300">{user.fullname}</p>
      </div>
    </div>
  );
};

export default UserCard;
