import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaChevronDown,
  FaClipboardList,
  FaSignOutAlt,
  FaMagic,
  FaTruck,
  FaTools,
  FaShieldAlt,
  FaWrench,
  FaInfoCircle,
} from 'react-icons/fa';
import { GiDiamondTrophy } from 'react-icons/gi';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSearch } from '../redux/slices/productSlice';
import { logout } from '../redux/slices/userSlice';
import { setCartItems } from '../redux/slices/cartSlice';
import { useTranslation } from 'react-i18next';
import MobileMenuPhoneNumbers from './MobileMenuPhoneNumbers';

const setLanguage = (language) => {
  localStorage.setItem('lang', language);
  window.location.reload();
};

const MobileMenu = ({ visible, setVisible, categories }) => {
  const { t } = useTranslation();
  const currentLanguage = localStorage.getItem('lang') || 'en';
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isServicesDropdownVisible, setServicesDropdownVisible] = useState(false);
  const [isInfoDropdownVisible, setInfoDropdownVisible] = useState(false);
  const { counter } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const serviceLinks = [
    { path: '/create', icon: <FaMagic />, label: 'create' },
    { path: '/repair', icon: <FaTools />, label: 'repair' },
    { path: '/delivery', icon: <FaTruck />, label: 'delivery' },
  ];

  const infoLinks = [
    { path: '/privacy', icon: <FaShieldAlt />, label: 'privacy' },
    { path: '/guarantee', icon: <GiDiamondTrophy />, label: 'guarantee' },
    { path: '/gia', icon: <FaWrench />, label: 'gia' },
    { path: '/about', icon: <FaInfoCircle />, label: 'about' },
  ];

  const handleCategoryClick = (categorySlug, hasChildren) => {
    if (hasChildren) {
      setActiveCategory((prev) => (prev === categorySlug ? null : categorySlug));
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
    if (!token) {
      navigate('/login');
      setProfileMenuOpen(false);

      setVisible(false);
    }
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
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between p-3">
            <div onClick={() => setVisible(false)} className="flex items-center gap-1">
              <MdOutlineKeyboardArrowLeft className="w-6 h-6 text-mainColor" />
              <p className="text-mainColor">{t('navbar.back')}</p>
            </div>
            <div className="flex items-center gap-6">
              <FaSearch
                className="w-5 h-5 cursor-pointer text-mainColor"
                onClick={handleSearchClick}
              />
              <div className="relative text-mainColor z-50">
                <FaUser
                  className="w-5 h-5 cursor-pointer text-mainColor"
                  onClick={handleProfileClick}
                />
                {isProfileMenuOpen && token && (
                  <div className="absolute right-0 bg-mainColor text-white w-40  shadow-lg z-50">
                    <div className="flex flex-col gap-2 py-3 px-5">
                      <div
                        className="mobile-menu-item flex items-center cursor-pointer hover:text-gray-300"
                        onClick={() => {
                          setVisible(false);
                          closeProfileMenu();
                          navigate('/profile');
                        }}>
                        <FaUser className="mr-1 inline-block" />
                        <span>{t('navbar.myProfile')}</span>
                      </div>
                      <div
                        onClick={() => {
                          navigate('/orders');
                          setVisible(false);
                          closeProfileMenu();
                        }}
                        className="mobile-menu-item flex items-center cursor-pointer hover:text-gray-300">
                        <FaClipboardList className="mr-1 inline-block" />
                        <span>{t('navbar.orders')}</span>
                      </div>
                      <div
                        className="mobile-menu-item flex items-center cursor-pointer hover:text-gray-300"
                        onClick={() => {
                          setVisible(false);
                          closeProfileMenu();
                          dispatch(logout());
                          dispatch(setCartItems([]));
                        }}>
                        <FaSignOutAlt className="mr-1 inline-block" />
                        <span>{t('navbar.logout')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/cart"
                onClick={() => setVisible(false)}
                className="relative text-mainColor">
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
            to="/"
            onClick={() => setVisible(false)}
            className="flex flex-col items-center gap-1 p-3">
            {t('navbar.menu.home')}
          </NavLink>
          <div className="flex flex-col">
            <div
              onClick={() => {
                if (categories.length > 0) {
                  handleCatalogClick();
                } else {
                  navigate('/catalog');
                  setVisible(false);
                }
              }}
              className={`relative flex items-center justify-center p-3 cursor-pointer z-40 ${
                isCatalogPage ? 'bg-mainColor text-white' : ''
              }`}>
              <p className="relative">{t('navbar.menu.catalog')}</p>
              {categories.length > 0 && (
                <FaChevronDown
                  className={`absolute transition-transform duration-300 ${
                    isDropdownVisible ? '-rotate-180' : ''
                  }`}
                  style={{ left: 'calc(60%)' }}
                />
              )}
            </div>
            {isDropdownVisible && categories.length > 0 && (
              <div className="pl-8 z-40 bg-white shadow-lg">
                {categories.map((category) => (
                  <div key={category._id} className="flex flex-col futura">
                    <div
                      onClick={() =>
                        handleCategoryClick(category.slug, category.children.length > 0)
                      }
                      className="flex items-center justify-between px-6 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
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
                              `flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100  ${
                                location.pathname ===
                                `/catalog/${category.slug}/${subCategory.slug}`
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

          {/* Services Dropdown */}
          <div className="flex flex-col">
            <div
              onClick={() => setServicesDropdownVisible(!isServicesDropdownVisible)}
              className={`relative flex items-center justify-center p-3 cursor-pointer z-40 ${
                isServicesDropdownVisible ? 'bg-mainColor text-white' : ''
              }`}>
              <p className="relative">{t('navbar.menu.service')}</p>
              <FaChevronDown
                className={`absolute transition-transform duration-300 ${
                  isServicesDropdownVisible ? '-rotate-180' : ''
                }`}
                style={{ left: 'calc(58.5%)' }}
              />
            </div>
            {isServicesDropdownVisible && (
              <div className="pl-8 z-40 bg-white shadow-lg">
                {serviceLinks.map((link) => (
                  <div
                    key={link.label}
                    onClick={() => {
                      navigate(link.path);
                      setVisible(false);
                    }}
                    className="flex items-center justify-between px-6 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-5 h-5 mr-3 text-mainColor">
                        {link.icon}
                      </div>
                      <span className="category-name">{t(`navbar.menu.${link.label}`)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Dropdown */}
          <div className="flex flex-col">
            <div
              onClick={() => setInfoDropdownVisible(!isInfoDropdownVisible)}
              className={`relative flex items-center justify-center p-3 cursor-pointer z-40 ${
                isInfoDropdownVisible ? 'bg-mainColor text-white' : ''
              }`}>
              <p>{t('navbar.menu.info')}</p>
              <FaChevronDown
                className={`absolute transition-transform duration-300 ${
                  isInfoDropdownVisible ? '-rotate-180' : ''
                }`}
                style={{ left: 'calc(65%)' }}
              />
            </div>
            {isInfoDropdownVisible && (
              <div className="pl-8 z-40 bg-white shadow-lg">
                {infoLinks.map((link) => (
                  <div
                    key={link.label}
                    onClick={() => {
                      navigate(link.path);
                      setVisible(false);
                    }}
                    className="flex items-center justify-between px-6 py-4 text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-5 h-5 mr-3 text-mainColor">
                        {link.icon}
                      </div>
                      <span>{t(`navbar.menu.${link.label}`)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <MobileMenuPhoneNumbers />
          <div className="flex items-center justify-center gap-2 p-3 border-t border-gray-200">
            {['en', 'ru', 'uk'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 border border-mainColor ${
                  currentLanguage === lang ? 'bg-mainColor text-white' : 'text-mainColor'
                } hover:bg-mainColor hover:text-white transition-colors`}>
                {t(`navbar.languages.${lang}`)}
              </button>
            ))}
          </div>{' '}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
