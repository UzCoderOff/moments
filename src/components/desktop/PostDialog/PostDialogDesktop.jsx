import { Button, Dialog, IconButton, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/config";
import "./PostDialogDesktop.scss";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  FieldValue,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import AccountCardMain from "../../accountcards/AccountCardMain";
import AccountCardComment from "../../accountcards/AccountCardComment";
import ReqModal from "../../modal/ReqModal";

const PostDialogDesktop = ({ post, open, setOpen }) => {
  const [like, setLike] = useState(post.likes.includes(auth.currentUser.uid));
  const [isSaved, setIsSaved] = useState(false);
  const [post_, setPost_] = useState({ ...post, id: post.id });
  const [comment, setComment] = useState("");
  const [isPostOwn, setIsPostOwn] = useState(false);
  const [isBackPress, setIsBackPress] = useState(false);

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

  const handleDelte = async () => {
    try {
      setIsBackPress(false)
      const postRef = doc(db, "posts", post_.id);
      deleteDoc(postRef);
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        posts: increment(-1),
      });
      window.location.reload()
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(post);

  return (
    <Dialog
      className="bg-transparent flex justify-center items-center shadow-transparent"
      open={open}
      handler={handleOpen}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-row bg-[#111] text-white rounded-lg overflow-hidden w-full">
        <div className="w-1/2">
          <img src={post.photoUrl} onClick={handleOpen} />
          <div className="text-white flex flex-row justify-between">
            <div className="flex flex-col align-middle justify-center p-3 items-center">
              <IconButton className="bg-transparent" onClick={handleLike}>
                {!like ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    width="32"
                    height="32"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="red"
                    stroke="red"
                    strokeWidth="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="34"
                    height="34"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                )}
              </IconButton>
              {!post.hideLikes ? (
                <h1>{post_.likes.length} likes</h1>
              ) : (
                <h1>Like</h1>
              )}
            </div>
            <div className="flex align-middle justify-center items-center flex-col">
              <IconButton className="bg-transparent" onClick={handleSave}>
                {!isSaved ? (
                  <svg
                    aria-label="Save"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height="32"
                    role="img"
                    viewBox="0 0 24 24"
                    width="32"
                  >
                    <title>Save</title>
                    <polygon
                      fill="none"
                      points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></polygon>
                  </svg>
                ) : (
                  <svg
                    aria-label="Remove"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height="32"
                    role="img"
                    viewBox="0 0 24 24"
                    width="32"
                  >
                    <title>Remove</title>
                    <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
                  </svg>
                )}
              </IconButton>
              <br />
            </div>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="border-b-[0.5px] flex flex-row">
            <ReqModal
              title={"Are you sure"}
              request={"Do you want to delte this post?"}
              back={handleDelte}
              setIsBackPress={setIsBackPress}
              isBackPress={isBackPress}
            />
            <AccountCardMain userId={post_.author} />
            {isPostOwn && (
              <Button
                variant="outlined"
                color="red"
                className="p-3"
                onClick={() => setIsBackPress(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </Button>
            )}
          </div>
          <div className="comments-container w-full h-full overflow-y-scroll hide-scrollbar flex flex-col">
            {post_.caption && (
              <AccountCardComment
                userId={post_.author}
                content={post_.caption}
              />
            )}
            {post_.comments.map((comment, index) => (
              <AccountCardComment
                key={index}
                userId={comment.author}
                content={comment.content}
              />
            ))}
          </div>
          {!post_.disableComments && (
            <form
              className="flex flex-row align-middle justify-center"
              onSubmit={handlePostComment}
            >
              <Input
                type="text"
                value={comment}
                color="white"
                onChange={(e) => setComment(e.target.value)}
                label="Add a comment..."
              />
              <Button
                type="submit"
                variant="text"
                color="blue"
                disabled={comment.trim() === ""}
              >
                Post
              </Button>
            </form>
          )}

          {post_.disableComments && (
            <div className="flex justify-center items-center">
              <h1 className="text-white">Commenting disabled for this post</h1>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default PostDialogDesktop;
