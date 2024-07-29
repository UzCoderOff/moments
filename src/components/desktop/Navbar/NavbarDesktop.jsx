import React, { useEffect, useState } from "react";
import "./NavbarDesktop.scss";
import { Button } from "@material-tailwind/react";
import SearchIcon from "../../../assets/search.png";
import AddIcom from "../../../assets/add.png";
import MessangerIcom from "../../../assets/messanger.png";
import ExploreIcon from "../../../assets/explore.png";
import HeartIcon from "../../../assets/heart.png";
import { auth, db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import More from "./More";
import { useNavigate } from "react-router-dom";
import Search from "../Search/Search";
import CreatePost from "../createpost/CreatePost";

const NavbarDesktop = () => {
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false)
  const nav = useNavigate();
  const [createPostOpen, setCreatePostOpen] = useState(false)

  useEffect(() => {
    const getUserInfo = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };
    getUserInfo();
  }, [auth.currentUser]);


  const openDrawer = () => {
    setOpen(true)
  }

  return (
    <div className="navDes z-50">
      <div className="navDes__logo">
        <h1 className="big-logo cursor-pointer" onClick={()=> nav('/')} >MOMENTS</h1>
        <h1 className="mini-logo cursor-pointer" onClick={()=> nav('/')}>M</h1>
      </div>
      <div className="links h-3/4">
        <Button onClick={() => nav('/')}>
          <svg
            aria-label="Home"
            className="x1lliihq x1n2onr6 x5n08af"
            fill="currentColor"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <title>Home</title>
            <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
          </svg>
          <span>Home</span>
        </Button>
        <Button onClick={openDrawer}>
          <img src={SearchIcon} alt="Search" />
          <span>Search</span>
        </Button>
        <Button onClick={()=> nav('/explore')}>
          <img src={ExploreIcon} alt="Explore" />
          <span>Explore</span>
        </Button>
        <Button onClick={()=> setCreatePostOpen(!createPostOpen)}>
          <img src={AddIcom} alt="Add" />
          <span>Create</span>
        </Button>
        <Button onClick={() => nav(`/${auth.currentUser?.displayName}/`)}>
          {userData && userData.userImage && (
            <img src={userData.userImage} className="rounded-full w-[30px] h-[30px]" alt="Profile" />
          )}
          <span>Profile</span>
        </Button>
      </div>
      <div className="more">
        <More userData={userData} />
      </div>
      <Search open={open} setOpen={setOpen}/>
      <CreatePost open={createPostOpen} setOpen={setCreatePostOpen}/>
    </div>
  );
};

export default NavbarDesktop;
