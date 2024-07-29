import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export const fetchPosts = async (user) => {
  try {
    console.log('Fetching posts for user:', user);
    const userPostsQuery = query(
      collection(db, "posts"),
      where("author", "==", user.uid),
      orderBy("created", "desc")
    );
    const userPostsSnapshot = await getDocs(userPostsQuery);
    const userPosts = userPostsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log('Fetched posts:', userPosts);
    return userPosts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};
