import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="bg-mainColor">
      <div className="flex py-10 flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm max-w-[1280px] mx-auto px-4">
        <div className="">
          <p className="text-2xl text-white mb-4">LOGO</p>
          <p className="w-full md:w-2/3 text-slate-300 font-light poppins text-[12px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, voluptates!
          </p>
        </div>
        <div className="">
          <p className="text-xl font-medium mb-5 text-white"> Company</p>
          <ul className="flex flex-col gap-1 text-slate-300 font-light poppins">
            <li>HOME</li>
            <li>ABOUT US</li>
            <li>DELIVERY</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5 text-white">Our Contacts</p>
          <ul className="flex flex-col gap-1 text-slate-300 font-light poppins">
            <li>INSTAGRAM</li>
            <li>+380-633-733-013</li>

            <li>test@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="">
        <hr />
        <p className="py-5 text-sm text-center text-white font-light poppins">
          Copyright 2025@ JEWERLY - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
