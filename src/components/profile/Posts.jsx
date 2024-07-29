import React, { useEffect, useState } from "react";
import "./Posts.scss";
import CameraIcon from "../../assets/camera.png";
import CreatePost from "../desktop/createpost/CreatePost";
import { fetchPosts } from "../../functions";
import PostCard from "../post/PostCard";

const Posts = ({ userData, isOwnProfile }) => {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPosts = await fetchPosts(userData);
      setPosts(fetchedPosts);
    };
    fetchData();
  }, [userData]);

  console.log("userData:", userData);
  console.log("posts:", posts);

  if (userData.posts === 0) {
    if (isOwnProfile) {
      return (
        <div
          className="text-white align-middle flex flex-col text-center gap-4 items-center"
          style={{ margin: "60px 44px" }}
        >
          <img
            src={CameraIcon}
            style={{ width: "62px", height: "62px", cursor: "pointer" }}
            draggable="false"
          />
          <h1 className="text-3xl font-extrabold font-sans">
            Share Your Moments
          </h1>
          <p className="text-sm font-light">
            When you share photos, they will appear on your profile.
          </p>
          <p
            className="text-blue-500 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Share your first photo
          </p>
          <CreatePost open={open} setOpen={setOpen} />
        </div>
      );
    } else {
      return (
        <div
          className="text-white align-middle flex flex-col text-center gap-4 items-center"
          style={{ margin: "60px 44px" }}
        >
          <img
            src={CameraIcon}
            style={{ width: "62px", height: "62px", cursor: "pointer" }}
            draggable="false"
          />
          <h1 className="text-3xl font-extrabold font-sans">No Posts Yet</h1>
        </div>
      );
    }
  }

  return (
    <div className="postsProfile text-white grid grid-cols-3 gap-2 xl:w-1/2 w-full lg:w-3/5 md:w-3/4 ">
      {posts &&
        posts.map((post) => (
          <PostCard post={post} key={post.id} />
        ))}
    </div>
  );
};

export default Posts;
