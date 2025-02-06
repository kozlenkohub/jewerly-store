import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaCaretDown } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toggleSearch } from '../redux/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { setCartItems } from '../redux/slices/cartSlice';
import Flag from 'react-world-flags';

const NavbarIcons = ({ iconColor, bgColor, textColor2 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpenSearch } = useSelector((state) => state.product);
  const { counter } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.user);
  const currentLanguage = localStorage.getItem('lang') || 'en';
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const setLanguage = (language) => {
    localStorage.setItem('lang', language);
    window.location.reload();
  };

  const handleSearchClick = () => {
    if (!location.pathname.includes('/catalog')) {
      navigate('/catalog');
      dispatch(toggleSearch(true));
    } else {
      dispatch(toggleSearch(!isOpenSearch));
    }
  };

  return (
    <>
      <FaSearch
        onClick={handleSearchClick}
        className={`w-5 h-5 cursor-pointer sm:block hidden ${iconColor}`}
      />
      <div className={`group relative sm:block hidden ${iconColor}`}>
        <FaUser
          onClick={() => {
            if (token) {
              //
            } else {
              navigate('/login');
            }
          }}
          className={`w-5 h-5 cursor-pointer ${iconColor}`}
        />
        {token && (
          <div className="group-hover:block hidden absolute dropdown-menu z-50 right-0 pt-2">
            <div className={`flex flex-col gap-2 w-36 py-3 px-5 ${bgColor} ${textColor2} `}>
              <Link to="/profile" className="cursor-pointer hover:text-gray-500 ">
                My Profile
              </Link>
              <p
                onClick={() => {
                  navigate('/orders');
                }}
                className="cursor-pointer hover:text-gray-500 ">
                Orders
              </p>
              <p
                onClick={() => {
                  dispatch(logout());
                  dispatch(setCartItems([]));
                  navigate('/');
                }}
                className="cursor-pointer hover:text-gray-500 ">
                LogOut
              </p>
            </div>
          </div>
        )}
      </div>
      <Link to="/cart" className={`relative sm:block hidden ${iconColor}`}>
        <FaShoppingCart className={`w-5 h-5 ${iconColor}`} />
        {counter > 0 && (
          <p className="absolute right-[-12px] bottom-[-9px] w-[20px] h-[20px] text-center leading-4 bg-secondaryColor text-white aspect-square rounded-full text-[12px]">
            {counter}
          </p>
        )}
      </Link>
      <div className="relative hidden sm:block">
        <div
          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          className={`flex items-center gap-2 cursor-pointer ${iconColor}`}>
          <span>{currentLanguage.toUpperCase()}</span>
          <FaCaretDown />
        </div>
        {isLanguageDropdownOpen && (
          <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 shadow-lg z-50">
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left ${
                currentLanguage === 'en' ? 'bg-mainColor text-white' : 'text-gray-700'
              } hover:bg-mainColor hover:text-white transition-colors`}>
              <Flag code="US" className="w-5 h-5" />
              EN
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left ${
                currentLanguage === 'ru' ? 'bg-mainColor text-white' : 'text-gray-700'
              } hover:bg-mainColor hover:text-white transition-colors`}>
              <Flag code="RU" className="w-5 h-5" />
              RU
            </button>
            <button
              onClick={() => setLanguage('uk')}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left ${
                currentLanguage === 'uk' ? 'bg-mainColor text-white' : 'text-gray-700'
              } hover:bg-mainColor hover:text-white transition-colors`}>
              <Flag code="UA" className="w-5 h-5" />
              UK
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NavbarIcons;
