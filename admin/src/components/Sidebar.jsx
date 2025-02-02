import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile when clicking a category
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      transform transition-transform duration-300 ease-in-out
      fixed md:relative
      w-full md:w-64
      h-full
      bg-white
      shadow-lg md:shadow-none
      z-20 md:z-0
      ${isOpen ? 'block' : 'md:block'}
    `}>
      <div className="p-4">
        <div className="space-y-4">
          <button
            onClick={() => handleNavigation('/add')}
            className="w-full text-left p-2 hover:bg-gray-100 rounded">
            Add
          </button>
          <button
            onClick={() => handleNavigation('/edit')}
            className="w-full text-left p-2 hover:bg-gray-100 rounded">
            Edit
          </button>
          {/* Add more navigation buttons as needed */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
