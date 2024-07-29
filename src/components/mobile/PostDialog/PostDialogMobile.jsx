import { Button, IconButton, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AccountCardComment from "../../accountcards/AccountCardComment";
import ReqModal from "../../modal/ReqModal";

const PostDialogMobile = ({ post, open, setOpen }) => {
  const [like, setLike] = useState(post.likes.includes(auth.currentUser.uid));
  const [isSaved, setIsSaved] = useState(false);
  const [post_, setPost_] = useState({ ...post, id: post.id });
  const [comment, setComment] = useState("");
  const [isPostOwn, setIsPostOwn] = useState(false);
  const [isBackPress, setIsBackPress] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(!open);
  };

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

  if (!open) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setIsBackPress(false);
      const postRef = doc(db, "posts", post_.id);
      await deleteDoc(postRef);
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        posts: increment(-1),
      });
      window.location.reload()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post-dialog-mobile flex flex-col fixed top-0 left-0 bg-black  w-full h-full overflow-y-scroll text-white">
      <ReqModal
        title={"Are you sure"}
        request={"Do you want to delte this post?"}
        back={handleDelete}
        setIsBackPress={setIsBackPress}
        isBackPress={isBackPress}
      />
      <div className="flex items-center justify-between p-3">
        <IconButton
          variant="text"
          color="white"
          onClick={handleOpen}
          className="text-3xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </IconButton>
        <h1 className="text-xl font-semibold">Post</h1>
        {isPostOwn && (
          <Button
            variant="outlined"
            color="red"
            className="p-3"
            onClick={()=> setIsBackPress(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9L14.4 18M9.26 9l.34 9m9.968-3.21c.342.052.682.107 1.022.166M18.16 5.79L18.502 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79M18.16 5.79c-.34-.059-.68-.114-1.022-.165m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </Button>
        )}
      </div>
      <div style={{ width: "100%", height: "auto", opacity: 1 }}>
        <img
          src={post.photoUrl}
          style={{ width: "100%", height: "auto", opacity: 1 }}
          className="bg-black"
        />
      </div>
      <div className="flex flex-row justify-between p-3">
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
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="red"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="32"
                height="32"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            )}
          </IconButton>
          <p>{post_.hideLikes ? "Like" : `${post_.likes.length} likes`}</p>
        </div>
        <div className="flex flex-col align-middle justify-center items-center">
          <IconButton className="bg-transparent" onClick={handleSave}>
            {isSaved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
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
                className="size-6"
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
      <div className="p-3">
        <div className="text-sm my-2">
          <AccountCardComment userId={post_.author} />
          <span>{post_.caption}</span>
        </div>
        {!post_.disableComments && (
          <form onSubmit={handlePostComment} className="flex items-center my-2">
            <Input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="mr-2 flex-grow bg-transparent border-b border-gray-600 text-white"
            />
            <Button type="submit" color="blue" className="p-2">
              Post
            </Button>
          </form>
        )}
        {post_.disableComments && (
          <div className="w-full h-11 flex align-middle justify-center items-center text-center bg-[#2525256e] rounded-md">
            <h1>Commenting disabled for this post</h1>
          </div>
        )}
        <div className="text-sm my-2">
          <span>View all {post_.comments.length} comments</span>
        </div>
        <div className="my-2">
          {post_.comments.map((comment, index) => (
            <div key={index} className="text-sm my-1 flex items-center">
              <AccountCardComment userId={comment.author} />
              <span className="ml-2">{comment.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDialogMobile;
