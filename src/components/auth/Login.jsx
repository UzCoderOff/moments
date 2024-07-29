import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import "./Auth.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const Login = () => {
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "LOGIN • Moments";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (emailRegex.test(emailOrUser)) {
      try {
      signInWithEmailAndPassword(auth, emailOrUser, password)
      }
      catch (err) {
        setErrorText("Invalid email or password");
        setIsLoading(false);
        }
    } else {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map((doc) => doc.data());
      const user = users.find((user) => user.username === emailOrUser);
      if (user) {
        signInWithEmailAndPassword(auth, user.email, password);
      } else {
        setErrorText("Invalid email or password");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="authWrapper flex flex-col items-center justify-center h-screen">
      <div className="text-center pb-10">
        <h1 className="text-5xl font-extralight pb-3">LOGIN</h1>
        <p className="text-gray-500">To Share Your Moments</p>
      </div>
      <div className="w-full max-w-md">
        <form
          className="shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
          onSubmit={onSubmit}
        >
          <div className="mb-4">
            <Input
              label="Email Or Username"
              color="blue"
              required
              onChange={(e) => setEmailOrUser(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Password"
              color="blue"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorText && (
            <p className="text-red-500 text-xs italic mb-4">{errorText}</p>
          )}
          <div className="flex items-center justify-between">
            <Button className="bg-blue-500 hover:bg-blue-700" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                "Login"
              )}
            </Button>
            <Link to="/signup">
              <span className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Don't have an Account?
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
