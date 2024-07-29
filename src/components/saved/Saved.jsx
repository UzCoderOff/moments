import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import Loading from "../loading/Loading";
import Info from "../profile/Info";
import "../profile/Profile.scss";
import SavedPosts from "./SavedPosts";

const Saved = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        return;
      }

      if (currentUser.displayName === username) {
        setIsOwnProfile(true);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      } else {
        navigate(`/${username}`);
      }
      
      setIsLoading(false);
    };

    fetchUserData();
  }, [username, navigate]);

  if (isLoading || !userData) {
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
        />
        <div
          className="text-white flex flex-row mt-4 justify-center gap-10 w-full xl:w-[935px] border-t"
          style={{ borderColor: "rgba(255, 255, 255, 0.164)" }}
        >
          <div
            className="flex flex-row align-middle items-center gap-2 pt-2 cursor-pointer"
            onClick={() => navigate(`/${userData.username}`)}
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
                <polygon
                  fill="none"
                  points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></polygon>
              </svg>
              <span>SAVED</span>
            </div>
          )}
        </div>
        <SavedPosts userData={userData} />
      </div>
    </div>
  );
};

export default Saved;
