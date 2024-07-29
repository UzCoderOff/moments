import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import "./NavbarMobile.scss";
import SearchIcon from "../../../assets/search.png";
import AddIcom from "../../../assets/add.png";
import MessangerIcom from "../../../assets/messanger.png";
import { auth, db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CreatePost from '../../desktop/createpost/CreatePost'

const NavbarMobile = () => {
  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState([]);
  const nav = useNavigate()

  useEffect(() => {
    const getUserInfo = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setUserData(docSnap.data());
    };
    getUserInfo();
  }, [auth.currentUser]);

  return (
    <div className="navMobile z-50">
      <CreatePost open={open} setOpen={setOpen} />
      <Button onClick={()=> nav('/')}>
        <svg
          aria-label="Home"
          class="x1lliihq x1n2onr6 x5n08af"
          fill="currentColor"
          height="34"
          role="img"
          viewBox="0 0 24 24"
          width="34"
        >
          <title>Home</title>
          <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
        </svg>
      </Button>
      <Button onClick={()=> nav('/explore')} >
        <img src={SearchIcon} />
      </Button>
      <Button onClick={()=> setOpen(true)}>
        <img src={AddIcom} />
      </Button>
      {/* <Button>
        <img src={MessangerIcom} />
      </Button> */}
      <Button onClick={()=> nav(`/${auth.currentUser.displayName}/`)}>
        <img src={userData.userImage} className="rounded-full w-[40px] h-[40px]" />
      </Button>
    </div>
  );
};

export default NavbarMobile;
