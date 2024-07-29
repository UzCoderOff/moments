import React, { useEffect, useState } from "react";
import { PostDialogDesktop } from "../desktop";
import { PostDialogMobile } from "../mobile";

const PostDialog = ({ post, open, setOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 735);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {!isMobile ? (
        <PostDialogDesktop post={post} open={open} setOpen={setOpen} />
      ) : (
        <PostDialogMobile post={post} open={open} setOpen={setOpen} />
      )}
    </div>
  );
};

export default PostDialog;
