import React, { useEffect, useState } from 'react';

import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets.js';

import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundOpacity = Math.min(scrollY / 300, 1);
  const textColor = scrollY > 150 ? 'text-gray-700' : 'text-white';
  const boxShadow = scrollY > 150 ? 'shadow-md' : '';

  return (
    <div
      className={`z-50 fixed top-0 w-full transition-all ${boxShadow}`}
      style={{ backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})` }}>
      <div className="max-w-[1280px] px-4 mx-auto">
        <div className="flex items-center justify-between py-5 font-medium">
          <Link className={textColor} to="/">
            <p>LOGO</p>
          </Link>
          <ul
            className={`hidden sm:flex gap-5 text-sm transition-colors duration-300 ${textColor}`}>
            <NavLink to="/" className="flex flex-col items-center gap-1">
              <p>Home</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
            </NavLink>
            <NavLink to="/catalog" className="flex flex-col items-center gap-1">
              <p>Catalog</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
            </NavLink>
            <NavLink to="/about" className="flex flex-col items-center gap-1">
              <p>About</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
            </NavLink>
            <NavLink to="/contact" className="flex flex-col items-center gap-1">
              <p>Contact</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
            </NavLink>
          </ul>
          <div className="flex items-center gap-6">
            <FaSearch className="w-5 h-5 cursor-pointer sm:block hidden" />
            <div className="group relative sm:block hidden">
              <FaUser className="w-5 h-5 cursor-pointer" />
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                  <p className="cursor-pointer hover:text-black">Orders</p>
                  <p className="cursor-pointer hover:text-black">LogOut</p>
                </div>
              </div>
            </div>
            <Link to="/cart" className="relative sm:block hidden">
              <FaShoppingCart className="w-5 h-5" />
              <p className="absolute right-[-12px] bottom-[-9px] w-[20px] h-[20px] text-center leading-4 bg-secondaryColor text-white aspect-square rounded-full text-[12px]">
                10
              </p>
            </Link>

            <FaBars
              onClick={() => setVisible(true)}
              className={`w-5 h-5 cursor-pointer sm:hidden transition-colors duration-300 ${
                scrollY > 150 ? 'text-mainColor' : 'text-white'
              }`}
            />
          </div>
          <div
            className={`fixed top-0 z-50 right-0 bottom-0 overflow-hidden bg-white transition-all ${
              visible ? 'w-full' : 'w-0'
            }`}>
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-3">
                <div onClick={() => setVisible(false)} className="flex items-center gap-1">
                  <MdOutlineKeyboardArrowLeft className="w-6 h-6" />
                  <p>Back</p>
                </div>
                <div className="flex items-center gap-6">
                  <FaSearch className="w-5 h-5 cursor-pointer" />
                  <div className="group relative">
                    <FaUser className="w-5 h-5 cursor-pointer" />
                    <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2">
                      <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                        <p className="cursor-pointer hover:text-black">My Profile</p>
                        <p className="cursor-pointer hover:text-black">Orders</p>
                        <p className="cursor-pointer hover:text-black">LogOut</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/cart" className="relative">
                    <FaShoppingCart className="w-5 h-5" />
                    {/* <p className="absolute right-[-12px] bottom-[-9px] w-[20px] h-[20px] text-center leading-4 bg-[#923f3f] text-white aspect-square rounded-full text-[12px]">
                      10
                    </p> */}
                  </Link>
                </div>
              </div>
              <NavLink
                onClick={() => {
                  setVisible(false);
                }}
                to="/"
                className="flex flex-col items-center gap-1 p-3">
                Home
              </NavLink>
              <NavLink
                onClick={() => {
                  setVisible(false);
                }}
                to="/catalog"
                className="flex flex-col items-center gap-1 p-3">
                Catalog
              </NavLink>
              <NavLink
                onClick={() => {
                  setVisible(false);
                }}
                to="/about"
                className="flex flex-col items-center gap-1 p-3">
                About
              </NavLink>
              <NavLink
                onClick={() => {
                  setVisible(false);
                }}
                to="/contact"
                className="flex flex-col items-center gap-1 p-3">
                Contact
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
