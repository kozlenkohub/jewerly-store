import React from 'react';
import { FaUserShield } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <FaUserShield className="w-12 h-12" />
      <button className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
