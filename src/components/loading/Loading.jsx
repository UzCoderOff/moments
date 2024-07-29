import React from 'react'
import { Spinner } from "@material-tailwind/react";


const Loading = () => {
    return (
        <div className="align-middle justify-center flex text-center items-center bg-black w-full h-[100vh] flex-col">
          <Spinner className="h-14 w-14" />
        </div>
      );
}

export default Loading