import React, { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";
import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { isEmailAvaible } from "../../functions";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import VerificationInput from "react-verification-input";
import "./Auth.scss";

const EmailVerification = ({
  email,
  setEmail,
  isCodeSend,
  setisCodeSend,
  users,
  isVerified,
  setIsVerified,
  userName,
  fullName,
  password,
  generatedCode,
  setGeneratedCode,
}) => {
  const [code, setCode] = useState("");
  const [isEmailAv, setisEmailAv] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [inputFocus, setInputFocus] = useState(false);

  const verificationInputRef = useRef(null);

  useEffect(() => {
    if (resendTimeout > 0 && isCodeSend) {
      const timer = setInterval(() => {
        setResendTimeout((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (resendTimeout === 0) {
      setCanResend(true);
    }
  }, [resendTimeout, isCodeSend]);

  const sendVerificationCode = () => {
    const generatedCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    setGeneratedCode(generatedCode);

    const templateParams = {
      to_name: "User",
      email,
      code: generatedCode,
    };

    emailjs
      .send(
        "service_kxf5g3c",
        "template_3u5sf9j",
        templateParams,
        "QsZbx_tbJflAH9uid"
      )
      .then((response) => {
        console.log("Verification code sent", response.status, response.text);
        setisCodeSend(true);
        setResendTimeout(60);
        setCanResend(false);
      })
      .catch((error) => {
        console.error("Failed to send verification code", error);
      });
  };

  const verifyCode = async () => {
    setIsLoading(true);
    if (code === generatedCode) {
      setIsVerified(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential) {
        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          email: email,
          phone_number: null,
          fullname: fullName,
          password: password,
          username: userName,
          gender: 'Prefer not to say',
          userImage:
            "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
          bio: '',
          followers: [],
          following: [],
          posts: 0,
          uid: user.uid,
          is_public: true,
          blocked: [],
          blocked_by: [],
          is_verified: true,
          is_banned: false,
          is_suspended: false,
          is_email_verified: true,
          is_phone_verified: false,
          saved: []
        });
        await updateProfile(user, {
          displayName: userName,
        });
        navigate("/");
      }
    } else {
      alert("Invalid verification code");
    }
    setIsLoading(false);
  };

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = () => {
    setInputFocus(false);
  };

  return (
    <div className="authWrapper flex flex-col items-center justify-center h-screen">
      <div className="text-center pb-10">
        <h1 className="text-5xl font-extralight pb-3">SIGNUP</h1>
        <p className="text-gray-500">to Create Moments</p>
      </div>
      <div className="w-full max-w-md">
        <div className="shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold mb-4">Verification</p>
            <p className="text-center">
              We sent a verification code to{" "}
              <span className="font-bold text-gray-800">{email}</span>
            </p>
            <br />
            <div className="mb-4 flex flex-col items-center w-full gap-8">
              <VerificationInput
                ref={verificationInputRef}
                length={6}
                onChange={(value) => setCode(value)}
                validChars="0-9"
                autoFocus={true}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className={`verification-input ${
                  inputFocus ? "focus" : ""
                } mb-4`}
              />
              <Button
                className={`h-10 flex items-center justify-center text-center mb-4 mt-11${
                  canResend ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400"
                }`}
                type="button"
                onClick={sendVerificationCode}
                disabled={!canResend}
              >
                {canResend ? "Resend Code" : `Resend in ${resendTimeout}s`}
              </Button>
            </div>
            <Button
              type="button"
              onClick={verifyCode}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {isLoading ? "Loading..." : "VERIFY CODE"}
            </Button>
          </div>
        </div>
        <div className="text-center text-blue-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
