import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loading from "../loading/Loading";
import {
  Input,
  Button,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { isUsernameAvailable } from "../../functions";
import { updateProfile } from "firebase/auth";

const EditProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    document.title = "Edit Profile • Moments";
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData(userData);
          setUsername(userData.username);
          setFullname(userData.fullname);
          setBio(userData.bio);
          setGender(userData.gender);
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false);
    };
    getUserInfo();
  }, [auth.currentUser, isPhotoLoading]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => doc.data());
      setAllUsers(users);
    };
    fetchAllUsers();
  }, []);

  const onImage = () => {
    if (
      userData.userImage !==
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
    ) {
      setShowConfirm(true);
    }
  };

  const handleConfirmDelete = async () => {
    const userDoc = doc(db, "users", userData.uid);
    await updateDoc(userDoc, {
      userImage:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    });
    setShowConfirm(false);
    window.location.reload();
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsPhotoLoading(true);
      try {
        const storageRef = ref(
          storage,
          `profilePictures/${auth.currentUser.uid}`
        );
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        const userDoc = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDoc, {
          userImage: downloadURL,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
      setIsPhotoLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value.trim();
    setUsername(newUsername);
    setIsUsernameAvailable(newUsername);
  };

  const setIsUsernameAvailable = async (newUsername) => {
    const minLength = 3;
    setIsUsernameValid(newUsername.length >= minLength);

    if (newUsername.length >= minLength) {
      await isUsernameAvailable(
        newUsername,
        setIsUsernameValid,
        setUsername,
        allUsers,
        userData.username
      );
    }
  };

  const handleSubmit = async () => {
    if (isUsernameValid) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, {
        username: username,
        fullname: fullname,
        bio: bio,
        gender: gender,
      });
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      window.location.reload();
    } else {
      alert(
        "Username is not valid or already taken. Please choose another one."
      );
    }
  };

  if (loading || isPhotoLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-row justify-center align-middle">
      <div>
        <Navbar />
      </div>
      <div
        className="py-8 bg-[#111] w-full flex align-middle items-center flex-col pb-20"
        style={{ color: "white" }}
      >
        <h1 className="font-bold text-2xl">Edit Profile</h1>
        <div className="pt-8">
          <div className="sm:w-[510px] h-20 bg-[#262626] rounded-xl p-4 flex align-middle justify-between ">
            <div className="flex flex-row align-middle justify-center gap-4 items-center">
              <img
                src={userData.userImage}
                className="w-14 h-14 rounded-full cursor-pointer"
                onClick={onImage}
              />
              <h1 className="sm:text-xl ">{userData.username}</h1>
            </div>
            <div>
              <label htmlFor="image">
                <div className="sm:w-32 w-14 font-thin sm:text-sm text-sm sm:h-8 flex items-center align-middle text-center  justify-center bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer">
                  Change Photo
                </div>
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="mt-4">
            <div>
              <h1>Change Username</h1>
              <Input
                label="Username"
                value={username}
                onChange={handleUsernameChange}
                error={!isUsernameValid}
              />
              {!isUsernameValid && (
                <p className="text-red-500">Username is not valid</p>
              )}
            </div>
            <div className="mt-4">
              <h1>Full Name</h1>
              <Input
                label="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <h1>Bio</h1>
              <Textarea
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <h1>Gender</h1>
              <Select
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e)}
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Prefer not to say">Prefer not to say</Option>
              </Select>
            </div>
            <div className="mt-4">
              <Button
                color="blue"
                onClick={handleSubmit}
                disabled={!isUsernameValid}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-[#262626] text-white p-6 rounded-lg w-96"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              Delete Profile Picture?
            </h2>
            <div className="text-center">
              <p>Are you sure you want to delete your profile picture?</p>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="w-full px-4 py-2 mr-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button
                className="w-full px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
