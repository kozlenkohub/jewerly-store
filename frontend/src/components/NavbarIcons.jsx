import React, { useState } from 'react';
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaCaretDown,
  FaClipboardList,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toggleSearch } from '../redux/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { setCartItems } from '../redux/slices/cartSlice';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';

const NavbarIcons = ({ iconColor, bgColor, textColor2 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpenSearch } = useSelector((state) => state.product);
  const { counter } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.user);
  const currentLanguage = localStorage.getItem('lang') || 'en';
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { t } = useTranslation();

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
            <div
              className={`flex flex-col gap-2 w-40 items-center py-3 px-5 ${bgColor} ${textColor2} `}>
              <Link to="/profile" className="cursor-pointer hover:text-gray-500">
                <div className="navbar-item flex items-center">
                  <FaUser className="mr-1 inline-block" />
                  <span>{t('navbar.myProfile')}</span>
                </div>
              </Link>
              <Link to="/orders" className="cursor-pointer hover:text-gray-500">
                <div className="navbar-item flex items-center">
                  <FaClipboardList className="mr-1 inline-block" />
                  <span>{t('navbar.orders')}</span>
                </div>
              </Link>
              <div
                onClick={() => {
                  dispatch(logout());
                  dispatch(setCartItems([]));
                  navigate('/');
                }}
                className="cursor-pointer hover:text-gray-500">
                <div className="navbar-item flex items-center">
                  <FaSignOutAlt className="mr-1 inline-block" />
                  <span>{t('navbar.logout')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Link to="/cart" className={`relative sm:block hidden ${iconColor}`}>
        <FaShoppingCart className={`w-5 h-5 ${iconColor}`} />
        {counter > 0 && (
          <p className="absolute right-[-12px] bottom-[-9px] w-[20px] h-[20px] text-center leading-4 bg-secondaryColor text-white aspect-square rounded-full text-[12px] ">
            {counter}
          </p>
        )}
      </Link>
      <div className="relative hidden sm:block">
        <div
          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          className={`flex items-center gap-2 cursor-pointer ${iconColor}`}>
          <span>{t(`navbar.languages.${currentLanguage}`)}</span>
          <FaCaretDown />
        </div>
        {isLanguageDropdownOpen && (
          <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 shadow-lg z-50">
            {['en', 'ru', 'uk'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex items-center gap-2 w-full px-4 py-2 text-left ${
                  currentLanguage === lang ? 'bg-mainColor text-white' : 'text-gray-700'
                } hover:bg-mainColor hover:text-white transition-colors`}>
                <div className={lang === 'ru' ? 'relative' : ''}>
                  <Flag
                    code={lang === 'en' ? 'US' : lang === 'uk' ? 'UA' : 'RU'}
                    className="w-5 h-5"
                  />
                  {lang === 'ru' && (
                    <div className="absolute top-1/2 -left-[2px] w-[25px] h-[2px] bg-red-600 transform -rotate-45"></div>
                  )}
                </div>
                {t(`navbar.languages.${lang}`)}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NavbarIcons;
