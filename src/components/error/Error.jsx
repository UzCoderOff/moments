import React, { useEffect, useState } from "react";

const Error = ({ error, setError }) => {
  const [time, setTime] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time - 1);
    }, 1000);
    if (time === 0) {
      clearInterval(timer);
      setError(null);
    }
    return () => clearInterval(timer);
  }, [time]);

  return (
    <div className="fixed top-3 right-4 bg-red-500 z-50 text-white text-xs p-3 flex flex-row align-middle justify-center items-center gap-1 rounded-xl cursor-pointer" onClick={()=> {
      setError(null);
      setTime(10)
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
      <p>
      {error}
      </p>
    </div>
  );
};

export default Error;
