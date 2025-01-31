import React from 'react';
import { DotLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="min-h-[100vh] relative">
      <div className="text-mainColor absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DotLoader color={'#1F3A63'} className="text-mainColor" />
      </div>
    </div>
  );
};

export default Loader;
