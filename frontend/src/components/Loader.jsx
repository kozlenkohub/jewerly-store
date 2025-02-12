import React from 'react';
import { DotLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="min-h-[100vh] relative">
      <div className="text-mainColor absolute top-1/3 sm:top-[38%] left-[45%] sm:left-[48%]">
        <DotLoader color={'#621b59'} className="text-mainColor" />
      </div>
    </div>
  );
};

export default Loader;
