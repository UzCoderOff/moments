import React, { useEffect, useState } from "react";
import { NavbarDesktop } from "../desktop";
import { NavbarMobile } from "../mobile";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col align-middle justify-center min-h-screen">
      <div>{isMobile ? <NavbarMobile /> : <NavbarDesktop />}</div>
    </div>
  );
}

export default Navbar