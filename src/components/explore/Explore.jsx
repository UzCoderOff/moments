import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import PostCard from "../post/PostCard";
import Search from "../mobile/search/Search";

const Explore = () => {
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("author", "!=", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(postsData);
        setPosts(postsData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-row align-middle justify-center min-h-screen">
        <div>
          <Navbar />
        </div>
        <div className="bg-[#111] w-full p-4  items-center flex flex-col">
          { isMobile && <Search />}
          <div className="grid grid-cols-3 md:gap-4 gap-1 xl:w-2/4 lg:w-3/4 md:w-5/6 w-full">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
