import { Input } from "@material-tailwind/react";
import { collection, getDocs } from "firebase/firestore";
import React, { useState } from "react";
import UserCard from "../../desktop/Search/UserCard";
import { auth, db } from "../../../firebase/config";

const Search = () => {
  const [result, setResult] = useState([]);

  const searchData = async (e) => {
    const inputVal = e.target.value.trim();
    if (inputVal === "") {
      setResult([]);
      return;
    }

    try {
      const usersCol = collection(db, "users");
      const querySnapshot = await getDocs(usersCol);
      const filteredRes = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (
          userData &&
          userData.username.includes(inputVal) &&
          userData.username !== auth.currentUser.displayName
        ) {
          filteredRes.push(userData);
        }
      });

      setResult(filteredRes);
    } catch (err) {
      console.log(err);
    }
  };

  const CD = () => {
    return null;
  }

  return (
    <div className="flex flex-col relative">
      <Input
        type="text"
        onChange={searchData}
        label="Search..."
        width={"100%"}
      />
      <div className="absolute top-11 z-50 bg-black w-full">
        {result.map((user) => {
          return <UserCard user={user} closeDrawer={CD} />;
        })}
      </div>
    </div>
  );
};

export default Search;
