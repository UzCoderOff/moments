import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDftspUulA3VvZ-DhwVK3h-eGaMr4zyBN4",
  authDomain: "moments-89969.firebaseapp.com",
  projectId: "moments-89969",
  storageBucket: "moments-89969.appspot.com",
  messagingSenderId: "862031959322",
  appId: "1:862031959322:web:bc794ae7b5e14813eec8a3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export {auth, storage, db}