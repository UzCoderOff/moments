import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import Loading from "../loading/Loading";
import Info from "./Info";
import Posts from "./Posts";
import "./Profile.scss";
import { isFollowed, handleFollow } from "../../functions";

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (userData?.fullname) {
      document.title = `${userData.fullname} (@${username}) • Moments`;
    } else {
      document.title = `@${username} • Moments`;
    }
  }, [userData, username]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsOwnProfile(false);

    if (currentUser && username === currentUser.displayName) {
      setIsOwnProfile(true);
      const docref = doc(db, "users", currentUser.uid);
      const snapDoc = await getDoc(docref);
      setUserData(snapDoc.data());
    } else {
      const userQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(userQuery);
      const userData = querySnapshot.docs[0]?.data();
      setUserData(userData);

      if (userData) {
        const following = await isFollowed(userData.uid);
        setIsFollowing(following);
      }
    }
    setIsLoading(false);
  }, [username, currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="profile-page flex flex-row align-middle justify-center ">
      <div>
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Info
          userData={userData}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          setIsFollowing={setIsFollowing}
          setUserData={setUserData}
        />
        <div
          className="text-white flex flex-row mt-4 justify-center gap-10 w-full xl:w-[935px] border-t"
          style={{ borderColor: "rgba(255, 255, 255, 0.164)" }}
        >
          <div
            className="flex flex-row align-middle items-center gap-2 pt-2 cursor-pointer"
            style={{ borderTop: "2px solid white" }}
          >
            <svg
              aria-label=""
              className="x1lliihq x1n2onr6 x5n08af"
              fill="currentColor"
              height="16"
              role="img"
              viewBox="0 0 24 24"
              width="16"
            >
              <title></title>
              <rect
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="18"
                x="3"
                y="3"
              ></rect>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="9.015"
                x2="9.015"
                y1="3"
                y2="21"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="14.985"
                x2="14.985"
                y1="3"
                y2="21"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="21"
                x2="3"
                y1="9.015"
                y2="9.015"
              ></line>
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="21"
                x2="3"
                y1="14.985"
                y2="14.985"
              ></line>
            </svg>
            <span>POSTS</span>
          </div>
          {isOwnProfile && (
            <div
              className="flex flex-row align-middle items-center gap-2 pt-2 cursor-pointer"
              onClick={() => nav(`/${userData.username}/saved`)}
            >
              <svg
                aria-label=""
                className="x1lliihq x1n2onr6 x5n08af"
                fill="currentColor"
                height="16"
                role="img"
                viewBox="0 0 24 24"
                width="16"
              >
                <title></title>
                <polygon
                  fill="none"
                  points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></polygon>
              </svg>
              SAVED
            </div>
          )}
        </div>
        <Posts userData={userData} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
};

export default Profile;
