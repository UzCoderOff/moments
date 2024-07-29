import { Button, IconButton, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import AccountCardMain from "../accountcards/AccountCardMain";
import PostDialog from "./PostDialog";

const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes.includes(auth.currentUser.uid));
  const [isSaved, setIsSaved] = useState(false);
  const [post_, setPost_] = useState({ ...post, id: post.id });
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      console.log("Fetching post data for post:", post.id);
      const docRef = doc(db, "posts", post.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Fetched post data:", docSnap.data());
        setPost_({ ...docSnap.data(), id: docSnap.id });
        setIsPostOwn(docSnap.data().author === auth.currentUser.uid);
      } else {
        console.log("No such document!");
      }
    };

    fetchPostData();
  }, [post, like]);

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().saved) {
        setIsSaved(docSnap.data().saved.includes(post.id));
      } else {
        setIsSaved(false);
      }
    };

    fetchUserData();
  }, [post.id]);

  const handleLike = async () => {
    try {
      const postRef = doc(db, "posts", post.id);

      if (like) {
        await updateDoc(postRef, {
          likes: arrayRemove(auth.currentUser.uid),
        });
        setLike(false);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(auth.currentUser.uid),
        });
        setLike(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      if (isSaved) {
        await updateDoc(docRef, {
          saved: arrayRemove(post.id),
        });
        setIsSaved(false);
      } else {
        await updateDoc(docRef, {
          saved: arrayUnion(post.id),
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    console.log("Posting comment for post:", post_);
    if (!post_.id) {
      console.log("Post ID is undefined");
      return;
    }

    try {
      const postRef = doc(db, "posts", post_.id);
      await updateDoc(postRef, {
        comments: arrayUnion({
          author: auth.currentUser.uid,
          content: comment,
        }),
      });
      setComment("");
      const updatedPost = await getDoc(postRef);
      setPost_({ ...updatedPost.data(), id: updatedPost.id });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full md:w-[468px] h-full bg-transparent text-white border-b-2 my-2">
      <AccountCardMain userId={post_.author} />
      <img src={post.photoUrl} alt="Post" className="w-full" />
      <div className="flex flex-row justify-between p-3">
        <div className="flex flex-row">
          <div className="flex flex-col align-middle justify-center items-center">
            <IconButton className="bg-transparent" onClick={handleLike}>
              {!like ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="32"
                  height="32"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              ) : (
                <svg
                  aria-label="Unlike"
                  class="x1lliihq x1n2onr6 xxk16z8"
                  fill="currentColor"
                  height="32"
                  role="img"
                  viewBox="0 0 48 48"
                  width="32"
                  color="red"
                >
                  <title>Unlike</title>
                  <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                </svg>
              )}
            </IconButton>
            <p>{post_.hideLikes ? "Like" : `${post_.likes.length} likes`}</p>
          </div>
          {!post_.disableComments && (
            <IconButton
              className="bg-transparent"
              onClick={() => setOpen(!open)}
            >
              <svg
                aria-label="Comment"
                class="x1lliihq x1n2onr6 x5n08af"
                fill="currentColor"
                height="32"
                role="img"
                viewBox="0 0 24 24"
                width="32"
              >
                <title>Comment</title>
                <path
                  d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </IconButton>
          )}
        </div>
        <div className="flex flex-col align-middle justify-center items-center pb-4">
          <IconButton className="bg-transparent" onClick={handleSave}>
            {isSaved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 3H6.75A2.25 2.25 0 004.5 5.25v15.69a.75.75 0 001.216.593L12 18.535l6.284 2.998a.75.75 0 001.216-.593V5.25A2.25 2.25 0 0017.25 3z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 3H6.75A2.25 2.25 0 004.5 5.25v15.69a.75.75 0 001.216.593L12 18.535l6.284 2.998a.75.75 0 001.216-.593V5.25A2.25 2.25 0 0017.25 3z"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <div className="flex flex-col justify-center p-3">
        <h1 className="font-semibold">{post_.authorUsername}</h1>
        <p>{post_.content}</p>
      </div>

      {!post_.disableComments ? (
        <form
          onSubmit={handlePostComment}
          className="flex flex-row justify-between p-3"
        >
          <Input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            label="Add a comment..."
            className="w-full mr-2"
          />
          <Button
            type="submit"
            color="blue"
            variant="text"
            disabled={comment.trim() === ""}
          >
            Post
          </Button>
        </form>
      ) : (
        <div className="text-gray-400 italic">
          Commenting disbaled for this post
        </div>
      )}
      <PostDialog post={post_} open={open} setOpen={setOpen} />
    </div>
  );
};

export default Post;
