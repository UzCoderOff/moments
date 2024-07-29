import React, { useRef, useState } from "react";
import PhotosIcon from "../../../assets/photos.png";
import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  Textarea,
  Switch,
} from "@material-tailwind/react";
import { useDropzone } from "react-dropzone";
import Error from "../../error/Error";
import ReqModal from "../../modal/ReqModal";
import { auth, db, storage } from "../../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, doc, increment, setDoc, updateDoc } from "firebase/firestore";

const CreatePost = ({ open, setOpen }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState();
  const [caption, setCaption] = useState("");
  const [hideLikes, setHideLikes] = useState(false);
  const [disableComments, setDisableComments] = useState(false);
  const inputRef = useRef(null);
  const [isBackPress, setIsBackPress] = useState(false);
  const [isNextPressed, setIsNextPressed] = useState(false);
  const [croppedBlob, setCroppedBlob] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size < 1024) {
        setError("File is too small. Please select a file larger than 1KB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          if (img.width < 300 || img.height < 300) {
            setError(
              "Image dimensions are too small. Please select an image with at least 300x300 pixels."
            );
            return;
          }
          setImage(file);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;

          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            size,
            size
          );

          canvas.toBlob((blob) => {
            setPreview(URL.createObjectURL(blob));
            setCroppedBlob(blob);
          }, "image/jpeg");
        };
      };
      reader.readAsDataURL(file);
    },
  });

  const handleSelectFromComputer = () => {
    inputRef.current.click();
  };

  const handleDialogClose = () => {
    if (image && preview) {
      setIsBackPress(true);
    } else {
      setOpen(!open);
      setImage(null);
      setPreview("");
      setError(null);
      setCaption("");
      setHideLikes(false);
      setDisableComments(false);
      setIsNextPressed(false);
    }
  };

  const back = () => {
    setIsBackPress(false);
    setOpen(!open);
    setImage(null);
    setPreview("");
    setError(null);
    setIsNextPressed(false);
    setCaption("");
    setHideLikes(false);
    setDisableComments(false);
  };

  const handlePostCreate = async () => {
    let photoUrl = "";

    if (croppedBlob) {
      const storageRef = ref(
        storage,
        `posts/${auth.currentUser.uid}/${image.name}`
      );
      await uploadBytes(storageRef, croppedBlob);
      photoUrl = await getDownloadURL(storageRef);
    }

    const post = {
      photoUrl,
      caption,
      author: auth.currentUser.uid,
      comments: [],
      likes: [],
      hideLikes,
      disableComments,
      created: new Date(),
    };

    const newPostRef = doc(collection(db, "posts"));

    await setDoc(newPostRef, post);

    const userRef = doc(collection(db, "users"), auth.currentUser.uid);
    await updateDoc(userRef, {
      posts: increment(1),
    });

    console.log({
      image,
      caption,
      disableComments,
      hideLikes,
      author: auth.currentUser.displayName,
    });
    setOpen(false);
    setImage(null);
    setPreview("");
    setCaption("");
    setHideLikes(false);
    setDisableComments(false);
    setIsNextPressed(false);
  };

  return (
    <Dialog open={open} handler={handleDialogClose} className="block bg-transparent">
      {error && <Error error={error} setError={setError} />}
      <ReqModal
        title={"Discard Post?"}
        request={"Are you sure you want to discard this post?"}
        back={back}
        setIsBackPress={setIsBackPress}
        isBackPress={isBackPress}
      />
      <DialogBody className="bg-[#262626] rounded-xl text-white p-0">
        <div className="flex flex-col h-[500px] sm:h-[600px] overflow-y-scroll hide-scrollbar">
          <div className="w-full text-center p-3 border-b border-[#333333] flex justify-between items-center">
            <Button
              className="bg-transparent rounded-full"
              onClick={handleDialogClose}
            >
              <svg
                aria-label="Back"
                className="x1lliihq x1n2onr6 x5n08af"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Back</title>
                <line
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  x1="2.909"
                  x2="22.001"
                  y1="12.004"
                  y2="12.004"
                ></line>
                <polyline
                  fill="none"
                  points="9.276 4.726 2.001 12.004 9.276 19.274"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></polyline>
              </svg>
            </Button>
            <h1 className="font-bold text-xl">Create New Post</h1>
            <div></div>
          </div>
          {!image ? (
            <div
              {...getRootProps()}
              className={`flex flex-col justify-center items-center h-full w-full cursor-pointer ${
                isDragActive ? "bg-[#333333]" : ""
              }`}
            >
              <input
                {...getInputProps()}
                ref={inputRef}
                aria-label="Drag and drop or select images"
              />
              <div className="flex align-middle justify-center items-center flex-col gap-3">
                <img
                  src={PhotosIcon}
                  className="createPost w-28 h-28"
                  alt="Photos Icon"
                  draggable={false}
                />
                <h1 className="font-light text-2xl">Drag photos here</h1>
                <div
                  onClick={handleSelectFromComputer}
                  className="bg-blue-500 p-2 rounded-lg text-base hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                  Select from computer
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row h-full">
              <div className="flex justify-center items-center w-full sm:w-1/2 p-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-full object-cover"
                />
              </div>
              {image && (
                <div className="flex flex-col w-full sm:w-1/2 p-4">
                  <Textarea
                    label="Caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mb-4 text-white"
                    color="blue"
                  />
                  <div className="flex items-center justify-between mb-4 mt-3">
                    <span>Hide Like Count</span>
                    <Switch
                      checked={hideLikes}
                      onChange={(e) => setHideLikes(e.target.checked)}
                      color="blue"
                      ripple={false}
                      className="w-full h-full"
                      containerProps={{
                        className: "w-11 h-6",
                      }}
                      circleProps={{
                        className: "before:hidden left-0.5 border-none",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span>Disable Comments</span>
                    <Switch
                      checked={disableComments}
                      onChange={(e) => setDisableComments(e.target.checked)}
                      color="blue"
                      ripple={false}
                      className="w-full h-full"
                      containerProps={{
                        className: "w-11 h-6",
                      }}
                      circleProps={{
                        className: "before:hidden left-0.5 border-none",
                      }}
                    />
                  </div>
                  <Button
                    className="bg-blue-500 p-2 rounded-lg text-base hover:bg-blue-700 transition duration-300 ease-in-out"
                    onClick={handlePostCreate}
                  >
                    Post
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default CreatePost;
