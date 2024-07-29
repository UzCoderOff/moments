import { Drawer, Typography } from "@material-tailwind/react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../../firebase/config";
import React, { useState, useRef, useEffect } from "react";
import UserCard from "./UserCard";

const Search = ({ open, setOpen}) => {
  const [isInputFocus, setIsInputFocus] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState([]);
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    searchData(e);
  };

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

  useEffect(() => {
    if (isInputFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputFocus]);

  const handleBlur = () => {
    if (searchText.length === 0) {
      setIsInputFocus(false);
    }
  };

  const closeDrawer = () => {
    setIsInputFocus(false);
    setSearchText('');
    setResult([]);
    setOpen(false)
  }

  const clearSearch = () => {
    setSearchText("");
    setResult([]);
    setIsInputFocus(false);
  };

  return (
    <Drawer
      className="bg-[#111] flex flex-col p-5"
      open={open}
      onClose={closeDrawer}
    >
      <div className="py-5">
        <Typography className="text-2xl font-bold text-white">Search</Typography>
      </div>
      <div className="flex flex-col py-5">
        {!isInputFocus ? (
          <div
            className="bg-[#222] rounded-md p-2 flex items-center gap-3 cursor-text"
            onClick={() => setIsInputFocus(true)}
          >
            <span className="material-symbols-outlined text-[#8E8E8E]">search</span>
            <span className="text-[#8E8E8E]">Search</span>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              className="bg-[#222] rounded-md p-2 focus:outline-none w-full text-white"
              placeholder="Search"
              ref={inputRef}
              value={searchText}
              onChange={handleSearchChange}
              onBlur={handleBlur}
            />
            {searchText && (
              <button
                id="btn"
                className="absolute top-1 right-1 text-gray-400 cursor-pointer flex align-middle justify-center hover:bg-transparent"
                onClick={clearSearch}
                style={{ width: "1.5rem", height: "1.5rem", padding: "0" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {result.map((user) => (
            <UserCard key={user.id} user={user} closeDrawer={closeDrawer} />
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default Search;
