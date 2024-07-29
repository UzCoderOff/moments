import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import Post from '../post/Post';
import { fetchPosts } from "../../functions/";

const RenderPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFollowedUserPosts = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const followedUserIds = userData.following || [];

          let allPosts = [];

          for (const userId of followedUserIds) {
            const userPosts = await fetchPosts({ uid: userId });
            allPosts = [...allPosts, ...userPosts];
          }

          allPosts.sort((a, b) => b.created - a.created);

          setPosts(allPosts);
        }
      } catch (error) {
        console.error("Error fetching followed user posts:", error);
      }
    };

    fetchFollowedUserPosts();
  }, []);

  return (
    <div className='flex flex-col gap-3'>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default RenderPosts;
