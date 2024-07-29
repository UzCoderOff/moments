import React from 'react';
import { Dialog, DialogBody, Button } from '@material-tailwind/react';

const ReqModal = ({ title, request, back, setIsBackPress, isBackPress }) => {
  return (
    <Dialog open={isBackPress} className='bg-transparent' >
      <DialogBody className="text-center p-5 bg-[#262626] rounded-xl text-white">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{request}</p>
        <div className="flex justify-center gap-4">
          <Button className="bg-red-500" onClick={back}>Yes</Button>
          <Button className="bg-gray-500" onClick={() => setIsBackPress(false)}>No</Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ReqModal;
