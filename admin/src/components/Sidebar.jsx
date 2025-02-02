import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <NavLink
        to="/add"
        className={({ isActive }) =>
          `flex items-center space-x-2 p-2 rounded ${
            isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`
        }>
        <FaPlus />
        <span>Add Page</span>
      </NavLink>
      {/* Add more navigation links here */}
    </div>
  );
};

export default Sidebar;
