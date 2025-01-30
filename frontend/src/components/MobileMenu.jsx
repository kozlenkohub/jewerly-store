import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaChevronDown } from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSearch } from '../redux/slices/productSlice';

const MobileMenu = ({ visible, setVisible, categories }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false); // Состояние для меню профиля
  const { counter } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleCategoryClick = (categorySlug, hasChildren, event) => {
    const isTextClick =
      event.target.tagName === 'DIV' && event.target.classList.contains('category-name');

    if (hasChildren) {
      if (isTextClick) {
        navigate(`/catalog/${categorySlug}`);
        setVisible(false);
      } else {
        setActiveCategory(activeCategory === categorySlug ? null : categorySlug);
      }
    } else {
      navigate(`/catalog/${categorySlug}`);
      setVisible(false);
    }
  };

  const handleCatalogClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleProfileClick = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setProfileMenuOpen(false);
  };

  const handleSearchClick = () => {
    setVisible(false);
    if (!location.pathname.includes('/catalog')) {
      navigate('/catalog');
      dispatch(toggleSearch(true));
    } else {
      dispatch(toggleSearch());
    }
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
            <div className="relative text-mainColor z-50">
              <FaUser
                className="w-5 h-5 cursor-pointer text-mainColor"
                onClick={handleProfileClick} // Открываем/закрываем дропдаун
              />
              {isProfileMenuOpen && (
                <div className="absolute right-0 bg-mainColor text-white w-36 rounded shadow-lg z-50">
                  <div className="flex flex-col gap-2 py-3 px-5">
                    <p
                      className="cursor-pointer hover:text-gray-300"
                      onClick={() => {
                        setVisible(false);
                        closeProfileMenu;
                      }}>
                      My Profile
                    </p>
                    <p
                      onClick={() => {
                        navigate('/orders');
                        setVisible(false);
                        closeProfileMenu();
                      }}
                      className="cursor-pointer hover:text-gray-300">
                      Orders
                    </p>
                    <p
                      className="cursor-pointer hover:text-gray-300"
                      onClick={() => {
                        setVisible(false);

                        closeProfileMenu;
                      }}>
                      LogOut
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Link to="/cart" onClick={() => setVisible(false)} className="relative text-mainColor">
              <FaShoppingCart className="w-5 h-5 text-mainColor" />
              {counter > 0 && (
                <p className="absolute right-[-7px] bottom-[-5px] w-[16px] h-[16px] text-center leading-3 bg-secondaryColor text-white aspect-square rounded-full text-[13px]">
                  {counter}
                </p>
              )}
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
            className={`relative flex items-center justify-center p-3 cursor-pointer z-40 ${
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
            <div className="pl-8 z-40 bg-white shadow-md">
              {categories.map((category) => (
                <div key={category._id} className="flex flex-col">
                  <div
                    onClick={(event) =>
                      handleCategoryClick(category.slug, category.children.length > 0, event)
                    }
                    className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer">
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
