import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import "./Auth.scss";
import { isUsernameAvailable, isEmailAvaible } from "../../functions";

const InputForm = ({
  email,
  setEmail,
  isCodeSend,
  setisCodeSend,
  users,
  setIsEmailValid,
  isEmailValid,
  setUserName,
  userName,
  setPassword,
  setFullName,
  password,
  sendVerificationCode,
  isLoading,
}) => {
  const [isUserAv, setIsUserAv] = useState(true);

  useEffect(() => {
    document.title = "Sign Up • Moments";
  }, []);

  return (
    <div className="authWrapper flex flex-col items-center justify-center h-screen">
      <div className="text-center pb-10">
        <Typography className="text-5xl font-extralight pb-3">
          Create Your Account
        </Typography>
        <p>Join Moments and share your favorite memories.</p>
      </div>
      <div className="w-full max-w-md bg-secondary shadow-lg rounded-lg p-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendVerificationCode();
          }}
        >
          <div className="mb-4">
            <Input
              label="Email"
              color={isEmailValid ? "green" : "red"}
              type="email"
              required
              onChange={(e) =>
                isEmailAvaible(e.target.value, users, setIsEmailValid, setEmail)
              }
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Input
              label="Full Name (optional)"
              color="blue"
              type="text"
              onChange={(e) => setFullName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Input
              label="Username"
              color={isUserAv ? "green" : "red"}
              type="text"
              required
              onChange={async (e) => {
                const isAvailable = await isUsernameAvailable(
                  e.target.value,
                  setIsUserAv,
                  setUserName,
                  users,
                  userName
                );
                setIsUserAv(isAvailable);
              }}
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <Input
              label="Password"
              color="blue"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <Checkbox
              color="light-blue"
              label={
                <span className="text-sm">
                  I agree to the{" "}
                  <a
                    href="/terms-of-service"
                    target="_blank"
                    className="text-blue-600"
                  >
                    terms of service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="text-blue-600"
                  >
                    privacy policy
                  </a>
                </span>
              }
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              color="primary"
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark"
              ripple={false}
              disabled={
                !(
                  isEmailValid &&
                  isUserAv &&
                  password.length >= 8 &&
                  !isLoading
                )
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  Loading...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
          <div className="text-center mt-4">
            <Link to="/login">
              <span className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
                Already have an account? Log in
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
