import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import MenuIcon from "../../../assets/menu.png";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";

const More = ({userData}) => {
  const [isMobile, setIsMobile] = useState(false);
  const nav = useNavigate()

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1265);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Menu placement={isMobile ? "right-start" : "top"} className="moreBtn">
      <MenuHandler>
        <Button>
          <img src={MenuIcon} alt="" />
          <span>More</span>
        </Button>
      </MenuHandler>
      <MenuList className="bg-[#262626] border-none text-white w-72">
        <MenuItem className="menu-item flex flex-row align-middle gap-2 font-sans p-4" onClick={()=> nav('/accounts/edit')}>
          <svg
            aria-label="Settings"
            class="x1lliihq x1n2onr6 x5n08af"
            fill="currentColor"
            height="18"
            role="img"
            viewBox="0 0 24 24"
            width="18"
          >
            <title>Settings</title>
            <circle
              cx="12"
              cy="12"
              fill="none"
              r="8.635"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></circle>
            <path
              d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096"
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="2"
            ></path>
          </svg>
          <span>Settings</span>
        </MenuItem>
        <MenuItem className="menu-item flex flex-row align-middle gap-2 font-sans p-4" onClick={()=> nav(`/${userData.username}/saved`)}>
          <svg
            aria-label="Saved"
            class="x1lliihq x1n2onr6 x5n08af"
            fill="currentColor"
            height="18"
            role="img"
            viewBox="0 0 24 24"
            width="18"
          >
            <title>Saved</title>
            <polygon
              fill="none"
              points="20 21 12 13.44 4 21 4 3 20 3 20 21"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            ></polygon>
          </svg>{" "}
          <span>Saved</span>
        </MenuItem>
        <hr className="my-3" />
        <MenuItem
          className="menu-item flex flex-row align-middle gap-2 font-sans p-4"
          onClick={() => {
            signOut(auth);
          }}
        >
          Log Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default More;
