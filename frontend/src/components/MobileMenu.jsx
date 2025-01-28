import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaChevronDown } from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { toggleSearch } from '../redux/slices/productSlice';

const MobileMenu = ({ visible, setVisible, categories }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleCategoryClick = (categorySlug, hasChildren, event) => {
    // Проверка на клик по тексту
    const isTextClick =
      event.target.tagName === 'DIV' && event.target.classList.contains('category-name');

    if (hasChildren) {
      if (isTextClick) {
        // Если клик по тексту, переходим на категорию
        navigate(`/catalog/${categorySlug}`);
        setVisible(false);
      } else {
        // Если клик по другому элементу, открываем/закрываем выпадающий список
        setActiveCategory(activeCategory === categorySlug ? null : categorySlug);
      }
    } else {
      // Для категорий без дочерних элементов, всегда переходим
      navigate(`/catalog/${categorySlug}`);
      setVisible(false);
    }
  };

  const handleCatalogClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleSearchClick = () => {
    setVisible(false);
    dispatch(toggleSearch());
  };

  const isCatalogPage = location.pathname.startsWith('/catalog');

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
            <FaSearch
              className="w-5 h-5 cursor-pointer text-mainColor"
              onClick={handleSearchClick}
            />
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
            className={`relative flex items-center justify-center p-3 cursor-pointer ${
              isCatalogPage ? 'bg-mainColor text-white' : ''
            }`}>
            <p className="relative">Catalog</p>
            <FaChevronDown
              className={`absolute transition-transform duration-300 ${
                isDropdownVisible ? '-rotate-180' : ''
              }`}
              style={{ left: 'calc(60%)' }}
            />
          </div>

          {isDropdownVisible && (
            <div className="pl-8">
              {categories.map((category) => (
                <div key={category._id} className="flex flex-col">
                  <div
                    onClick={(event) =>
                      handleCategoryClick(category.slug, category.children.length > 0, event)
                    }
                    className={`flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer futura
                    }`}>
                    <div className="flex items-center">
                      <img src={category.icon} alt={category.name} className="w-6 h-6 mr-2" />
                      <span className="category-name">{category.name}</span>
                    </div>
                    {category.children && category.children.length > 0 && (
                      <FaChevronDown
                        className={`ml-2 transition-transform duration-300 ${
                          activeCategory === category.slug ? '-rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                  {category.children && activeCategory === category.slug && (
                    <div className="pl-8">
                      {category.children.map((subCategory) => (
                        <NavLink
                          key={subCategory._id}
                          to={`/catalog/${category.slug}/${subCategory.slug}`}
                          className={({ isActive }) =>
                            `flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 futura ${
                              location.pathname === `/catalog/${category.slug}/${subCategory.slug}`
                                ? 'bg-gray-200'
                                : ''
                            }`
                          }
                          onClick={() => setVisible(false)}>
                          <div className="flex items-center">
                            <img
                              src={subCategory.icon}
                              alt={subCategory.name}
                              className="w-6 h-6 mr-2"
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
