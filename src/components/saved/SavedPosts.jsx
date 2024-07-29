import React, { useEffect, useState } from "react";
import SavedIcon from "../../assets/saved.png";
import { fetchSavedPosts } from "../../functions";
import PostCard from "../post/PostCard";

const SavedPosts = ({ userData }) => {
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const posts = await fetchSavedPosts(userData);
      setPostsData(posts);
    };
    fetchData();
  }, []);

  console.log(postsData)

  if (userData.saved.length == 0 || postsData.length === 0) {
    return (
      <div
        className="text-white align-middle flex flex-col text-center gap-4 items-center"
        style={{ margin: "60px 44px" }}
      >
        <img
          src={SavedIcon}
          style={{ width: "62px", height: "62px", cursor: "pointer" }}
          draggable="false"
        />
        <h1 className="text-3xl font-extrabold font-sans">Start Saving</h1>
        <p className="text-sm font-light">
          Start saving photos to your collection
        </p>
        <p className="text-[gray]">Only you can see what you save</p>
      </div>
    );
  } else {
    return (
      <div className="postsProfile text-white grid grid-cols-3 gap-2 xl:w-1/2 w-full lg:w-3/5 md:w-3/4 ">
        {postsData && postsData.map((post) => <PostCard post={post} key={post.id} />)}
      </div>
    );
  }
};

export default SavedPosts;
