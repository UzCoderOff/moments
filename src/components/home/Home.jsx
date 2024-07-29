import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import RenderPosts from "./RenderPosts";
import Suggestions from "../suggestions/Suggestions";

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1445);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.title = "Moments";
  }, []);

  return (
    <div className="flex flex-row align-middle justify-center min-h-screen">
      <div>
        <Navbar />
      </div>
      <div className="bg-[#111] w-full flex flex-row align-middle pt-2 justify-around pb-12">
        {!isMobile && <div></div>}
        <RenderPosts />
        {!isMobile && <Suggestions />}
      </div>
    </div>
  );
};

export default Home;
