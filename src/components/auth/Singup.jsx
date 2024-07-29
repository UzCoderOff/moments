import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import InputForm from "./InputForm";
import EmailVerification from "./EmailVerification";
import emailjs from "emailjs-com";
import "./Auth.scss";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [isCodeSend, setisCodeSend] = useState(false);
  const [users, setUsers] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [userName, setUserName] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "SIGNUP • Moments";
  }, []);

  useEffect(() => {
    window.onbeforeunload = () => {
      return "";
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(querySnapshot.docs.map((doc) => doc.data()));
    };
    getUsers();
  }, []);

  const sendVerificationCode = () => {
    setIsLoading(true);
    const generatedCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    setGeneratedCode(generatedCode);

    const templateParams = {
      to_name: fullName,
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

    setIsLoading(false);
  };

  return (
    <>
      {!isCodeSend ? (
        <InputForm
          email={email}
          setEmail={setEmail}
          isCodeSend={isCodeSend}
          setisCodeSend={setisCodeSend}
          users={users}
          setIsEmailValid={setIsEmailValid}
          isEmailValid={isEmailValid}
          setUserName={setUserName}
          userName={userName}
          setPassword={setPassword}
          setFullName={setfullName}
          password={password}
          sendVerificationCode={sendVerificationCode}
          isLoading={isLoading}
        />
      ) : (
        <EmailVerification
          email={email}
          setEmail={setEmail}
          isCodeSend={isCodeSend}
          setisCodeSend={setisCodeSend}
          users={users}
          isVerified={isVerified}
          setIsVerified={setIsVerified}
          userName={userName}
          fullName={fullName}
          password={password}
          generatedCode={generatedCode}
          setGeneratedCode={setGeneratedCode}
        />
      )}
    </>
  );
};

export default Signup;
