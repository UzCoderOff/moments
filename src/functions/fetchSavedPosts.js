import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const fetchSavedPosts = async (user) => {
  try {
    const savedPostIds = user.saved;
    const postRefs = savedPostIds.map((id) => doc(db, "posts", id));

    const savedPostsSnapshot = await Promise.all(postRefs.map(ref => getDoc(ref)));

    const savedPosts = savedPostsSnapshot.map((doc) => {
      if (doc.exists()) {
        return {
          ...doc.data(),
          id: doc.id,
        };
      } else {
        return null;
      }
    }).filter(Boolean);

    return savedPosts;
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return [];
  }
};
