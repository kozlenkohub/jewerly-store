import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { FaChevronDown } from 'react-icons/fa';

const Footer = () => {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isContactsDropdownOpen, setIsContactsDropdownOpen] = useState(false);

  const toggleCompanyDropdown = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
  };

  const toggleContactsDropdown = () => {
    setIsContactsDropdownOpen(!isContactsDropdownOpen);
  };

  return (
    <div className="bg-mainColor">
      <div className="flex pt-10 flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-4 mt-10 mb-7 text-sm max-w-[1280px] mx-auto px-4">
        <div className="">
          <p className="text-2xl text-white mb-4">LOGO</p>
          <p className="w-full md:w-2/3 text-slate-300 font-light poppins text-[12px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, voluptates!
          </p>
        </div>
        <div className="">
          <div
            className="flex items-center justify-between text-xl font-medium mb-5 text-white cursor-pointer sm:cursor-default"
            onClick={toggleCompanyDropdown}>
            <span>Company</span>
            <FaChevronDown
              className={`transition-transform sm:hidden ${
                isCompanyDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          {(isCompanyDropdownOpen || window.innerWidth >= 640) && (
            <ul className="flex flex-col gap-1 text-slate-300 font-light poppins">
              <li>HOME</li>
              <li>ABOUT US</li>
              <li>DELIVERY</li>
              <li>Privacy Policy</li>
            </ul>
          )}
        </div>
        <div>
          <div
            className="flex items-center justify-between text-xl font-medium mb-5 text-white cursor-pointer sm:cursor-default"
            onClick={toggleContactsDropdown}>
            <span>Our Contacts</span>
            <FaChevronDown
              className={`transition-transform sm:hidden ${
                isContactsDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          {(isContactsDropdownOpen || window.innerWidth >= 640) && (
            <ul className="flex flex-col gap-1 text-slate-300 font-light poppins">
              <li>INSTAGRAM</li>
              <li>+380-633-733-013</li>
              <li>test@gmail.com</li>
            </ul>
          )}
        </div>
      </div>
      <div className="">
        <hr />
        <p className="py-3 text-sm text-center text-white font-light poppins">
          Copyright 2025@ JEWERLY - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
