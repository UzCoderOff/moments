import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const AccountCardComment = ({ userId, content }) => {
  const [userData, setUserData] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchUserData();
  }, [userId]);

  console.log(userData);

  return (
    <div className="w-full h-auto flex flex-row align-middle justify-start items-start pl-4 gap-3 py-2 text-left">
      <img
        src={userData.userImage}
        className="w-8 h-8 rounded-full cursor-pointer"
        onClick={() => nav(`/${userData.username}`)}
        alt="User"
      />
      <div className="flex flex-row justify-start items-start">
        <h1
          className="cursor-pointer font-bold"
          onClick={() => nav(`/${userData.username}`)}
        >
          {userData.username}
        </h1>
        <p className="font-thin break-words">{content}</p>
      </div>
    </div>
  );
};

export default AccountCardComment;
