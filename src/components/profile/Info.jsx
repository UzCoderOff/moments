import React from "react";
import "./Info.scss";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { handleFollow } from "../../functions";

const Info = ({ userData, isOwnProfile, isFollowing, setIsFollowing, setUserData }) => {
  const nav = useNavigate();

  return (
    <div className="infoProfile text-white mx-auto flex align-middle justify-center">
      <div className="img">
        <img src={userData.userImage} alt="User profile" />
      </div>
      <div className="data">
        <div className="content first-letter">
          <h1 className="text-xl">{userData.username}</h1>
          {isOwnProfile ? (
            <Button onClick={() => nav("/accounts/edit")}>Edit Profile</Button>
          ) : (
            <div className="button-group">
              <Button onClick={() => handleFollow(userData.uid, setIsFollowing, setUserData)}>
                {!isFollowing ? "Follow" : "Unfollow"}
              </Button>
            </div>
          )}
        </div>
        <div className="content">
          <h1>{userData.posts} posts</h1>
          <h1>{userData.followers.length} followers</h1>
          <h1>{userData.following.length} following</h1>
        </div>
        <div className="content">
          <h1 className="font-bold">{userData.fullname}</h1>
        </div>
        <div className="content">
          <h1 className="font-thin">{userData.bio}</h1>
        </div>
      </div>
    </div>
  );
};

export default Info;
