import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const AccountCardMain = ({ userId }) => {
  const [userData, setUserData] = useState({});
  const nav = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", userId);
      const docSanp = getDoc(docRef).then((docSnap) => {
        setUserData(docSnap.data());
      });
    };
    fetchUserData();
  }, [userId]);


  return (
    <div className="w-full h-14  flex flex-row align-middle justify-start items-center pl-4 gap-3">
      <img src={userData.userImage} className="w-8 h-8 rounded-full cursor-pointer" onClick={()=> nav(`/${userData.username}`)} />
      <h1 className="cursor-pointer font-bold" onClick={()=> nav(`/${userData.username}`)}>{userData.username}</h1>
    </div>
  );
};

export default AccountCardMain;
