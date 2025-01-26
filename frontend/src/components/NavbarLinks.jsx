import React, { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const NavbarLinks = ({ textColor, categories }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  let timeoutId;

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timeoutId);
    setDropdownVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutId = setTimeout(() => {
      setDropdownVisible(false);
      setActiveCategory(null);
    }, 120);
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId, hasChildren, event) => {
      // Check if click was on text content
      const isTextClick =
        event.target.tagName === 'DIV' && event.target.classList.contains('category-name');

      if (hasChildren) {
        if (isTextClick) {
          // If clicked on text, navigate
          navigate(`/catalog?category=${categoryId}`);
        } else {
          // If clicked elsewhere, toggle dropdown
          setActiveCategory(activeCategory === categoryId ? null : categoryId);
        }
      } else {
        // For categories without children, always navigate
        setDropdownVisible(false);
        setActiveCategory(null);
        navigate(`/catalog?category=${categoryId}`);
      }
    },
    [activeCategory, navigate],
  );

  return (
    <ul className={`hidden sm:flex gap-5 text-sm transition-colors duration-300 ${textColor}`}>
      <NavLink to="/" className="flex flex-col items-center gap-1">
        <p>Home</p>
        <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
      </NavLink>
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <NavLink to="/catalog" className="flex flex-col items-center gap-1">
          <p>Catalog</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
        </NavLink>
        <div
          className={`absolute ${
            isDropdownVisible ? 'flex' : 'hidden'
          } flex-col bg-white shadow-lg rounded mt-2 w-64 transition-opacity duration-300 opacity-100`}>
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col">
              <div
                onClick={(event) => handleCategoryClick(category.id, !!category.childrens, event)}
                className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer futura">
                <div className="flex items-center">
                  <img src={category.icon} alt={category.name} className="w-4 h-4 mr-2" />
                  <span className="category-name">{category.name}</span>
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
                      className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 futura">
                      <img src={subCategory.icon} alt={subCategory.name} className="w-4 h-4 mr-2" />
                      {subCategory.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <NavLink to="/about" className="flex flex-col items-center gap-1">
        <p>About</p>
        <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
      </NavLink>
      <NavLink to="/contact" className="flex flex-col items-center gap-1">
        <p>Contact</p>
        <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
      </NavLink>
    </ul>
  );
};

export default NavbarLinks;
