import React, { useEffect, useState } from "react";
import AccountCard from "../accountcards/AccountCard";
import { Typography } from "@material-tailwind/react";
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const Suggestions = ({ setIsSuggestionsRendered }) => {
  const [users, setUsers] = useState([]);
  const nav = useNavigate()

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
        setIsSuggestionsRendered(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <div className="recomendeds w-96 flex flex-col align-middle text-wrap text-center text-white gap-3">
        <div className="flex flex-row justify-between pr-6 mb-3">
          <Typography>Suggested for you </Typography>
          <button className="text-white hover:text-gray-400" onClick={()=> nav('/explore/people')}>See All</button>
        </div>
        {users.slice(0, 5).map((user) => (
          <AccountCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
