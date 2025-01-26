import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaChevronDown } from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

const MobileMenu = ({ visible, setVisible, categories }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId, hasChildren, event) => {
    if (hasChildren && event.target.tagName !== 'svg' && event.target.tagName !== 'path') {
      navigate(`/catalog?category=${categoryId}`);
      setVisible(false);
    } else if (hasChildren) {
      setActiveCategory(activeCategory === categoryId ? null : categoryId);
    } else {
      navigate(`/catalog?category=${categoryId}`);
      setVisible(false);
    }
  };

  const handleCatalogClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <div
      className={`fixed top-0 z-50 right-0 bottom-0 overflow-hidden bg-white transition-all ${
        visible ? 'w-full' : 'w-0'
      }`}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-3">
          <div onClick={() => setVisible(false)} className="flex items-center gap-1">
            <MdOutlineKeyboardArrowLeft className="w-6 h-6 text-mainColor" />
            <p className="text-mainColor">Back</p>
          </div>
          <div className="flex items-center gap-6">
            <FaSearch className="w-5 h-5 cursor-pointer text-mainColor" />
            <div className="group relative text-mainColor">
              <FaUser className="w-5 h-5 cursor-pointer text-mainColor" />
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                  <p className="cursor-pointer hover:text-black">Orders</p>
                  <p className="cursor-pointer hover:text-black">LogOut</p>
                </div>
              </div>
            </div>
            <Link to="/cart" className="relative text-mainColor">
              <FaShoppingCart className="w-5 h-5 text-mainColor" />
            </Link>
          </div>
        </div>
        <NavLink
          onClick={() => setVisible(false)}
          to="/"
          className="flex flex-col items-center gap-1 p-3">
          Home
        </NavLink>
        <div className="flex flex-col">
          <div
            onClick={handleCatalogClick}
            className="flex items-center justify-center p-3 cursor-pointer relative">
            <p>Catalog</p>
            <FaChevronDown
              className={`transition-transform duration-300 absolute right-0 ${
                isDropdownVisible ? '-rotate-180' : ''
              }`}
              style={{ marginRight: '11px' }}
            />
          </div>
          {isDropdownVisible && (
            <div className="pl-8">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col">
                  <div
                    onClick={(event) =>
                      handleCategoryClick(category.id, !!category.childrens, event)
                    }
                    className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer futura">
                    <div className="flex items-center">
                      <img src={category.icon} alt={category.name} className="w-4 h-4 mr-2" />
                      {category.name}
                    </div>
                    {category.childrens && (
                      <FaChevronDown
                        className={`ml-2 transition-transform duration-300 ${
                          activeCategory === category.id ? '-rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                  {category.childrens && activeCategory === category.id && (
                    <div className="pl-8">
                      {category.childrens.map((subCategory) => (
                        <NavLink
                          key={subCategory.id}
                          to={`/catalog?category=${subCategory.id}`}
                          className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 futura"
                          onClick={() => setVisible(false)}>
                          <div className="flex items-center">
                            <img
                              src={subCategory.icon}
                              alt={subCategory.name}
                              className="w-4 h-4 mr-2"
                            />
                            {subCategory.name}
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <NavLink
          onClick={() => setVisible(false)}
          to="/about"
          className="flex flex-col items-center gap-1 p-3">
          About
        </NavLink>
        <NavLink
          onClick={() => setVisible(false)}
          to="/contact"
          className="flex flex-col items-center gap-1 p-3">
          Contact
        </NavLink>
      </div>
    </div>
  );
};

export default MobileMenu;
