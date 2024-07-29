import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import AccountCard from "../accountcards/AccountCard";
import { auth, db } from "../../firebase/config";

const ExplorePeople = () => {
  const [users, setUsers] = useState([]);
  const nav = useNavigate();

  const isOwnAcc = (e) => {
    return !(e.username === auth.currentUser.displayName);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userCol = collection(db, "users");
        const userSnapshot = await getDocs(userCol);
        const userData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData.filter(isOwnAcc));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-row justify-center ">
      <Navbar />
      <div className="flex flex-col items-center w-full md:w-2/5 pt-4">
        <h1 className="text-white text-lg font-bold mb-4">Suggested</h1>
        <div className="flex flex-col items-center gap-4 w-full">
          {users.map((user) => (
            <AccountCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePeople;
