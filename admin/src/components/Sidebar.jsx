import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div>
      <div className="">
        <NavLink to="/add">
          <p>Add Items</p>
        </NavLink>

        <FaPlus />
      </div>
    </div>
  );
};

export default Sidebar;
