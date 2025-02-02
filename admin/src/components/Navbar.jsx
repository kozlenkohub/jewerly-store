import React from 'react';
import { FaUserShield } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <button className="md:hidden p-2" onClick={toggleSidebar}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1 text-center">Admin Panel</div>
          <FaUserShield className="w-12 h-12" />
          <button className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
