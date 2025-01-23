import React from 'react';
import { MdCurrencyExchange } from 'react-icons/md';
import { IoDiamond } from 'react-icons/io5';
import { BiSupport } from 'react-icons/bi';

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base max-w-[1280px] mx-auto  ">
      <div className="">
        <MdCurrencyExchange className="m-auto mb-3 w-12 h-12" />

        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400 font-light poppins">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </p>
      </div>
      <div className="">
        <IoDiamond className="m-auto mb-3 w-12 h-12" />

        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400 font-light poppins">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </p>
      </div>
      <div className="">
        <BiSupport className="m-auto mb-3 w-12 h-12" />

        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-400 font-light poppins">
          Lorem ipsum dolor sit amet consectetur adipisicing.
        </p>
      </div>
    </div>
  );
};

export default OurPolicy;
