import React, { useState } from "react";
import "./PostCard.scss";
import PostDialog from "./PostDialog";

const PostCard = ({ post }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="post-card cursor-pointer overflow-hidden transition-opacity hover:opacity-90 m-2 z-10">
        <img
          className="post-card-img object-cover object-center z-0"
          src={post.photoUrl}
          onClick={() => setOpen(true)}
        />
      </div>
      <PostDialog post={post} open={open} setOpen={setOpen} />
    </div>
  );
};

export default PostCard;
