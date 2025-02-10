import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaChevronDown,
  FaInfoCircle,
  FaTools,
  FaTruck,
  FaShieldAlt,
  FaWrench,
  FaMagic,
} from 'react-icons/fa';

const NavbarLinks = ({ textColor, categories }) => {
  const { t } = useTranslation();
  const [isCatalogDropdownVisible, setCatalogDropdownVisible] = useState(false);
  const [isInfoDropdownVisible, setInfoDropdownVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  let catalogTimeoutId;
  let infoTimeoutId;

  const handleCatalogMouseEnter = useCallback(() => {
    clearTimeout(catalogTimeoutId);
    setCatalogDropdownVisible(true);
  }, []);

  const handleCatalogMouseLeave = useCallback(() => {
    catalogTimeoutId = setTimeout(() => {
      setCatalogDropdownVisible(false);
      setActiveCategory(null);
    }, 120);
  }, []);

  const handleInfoMouseEnter = useCallback(() => {
    clearTimeout(infoTimeoutId);
    setInfoDropdownVisible(true);
  }, []);

  const handleInfoMouseLeave = useCallback(() => {
    infoTimeoutId = setTimeout(() => {
      setInfoDropdownVisible(false);
    }, 120);
  }, []);

  const handleCategoryClick = useCallback(
    (categorySlug, hasChildren, event) => {
      // Проверка на клик по тексту
      const isTextClick =
        event.target.tagName === 'DIV' && event.target.classList.contains('category-name');

      if (hasChildren) {
        // Если у категории есть дочерние элементы
        if (isTextClick) {
          // Если клик по тексту, переходим на категорию
          navigate(`/catalog/${categorySlug}`);
        } else {
          // Если клик по другому элементу, открываем/закрываем выпадающий список
          setActiveCategory(activeCategory === categorySlug ? null : categorySlug);
        }
      } else {
        // Для категорий без дочерних элементов, всегда переходим
        setCatalogDropdownVisible(false);
        setActiveCategory(null);
        navigate(`/catalog/${categorySlug}`);
      }
    },
    [activeCategory, navigate],
  );

  const serviceLinks = [
    { path: '/about', icon: <FaInfoCircle />, label: 'about' },
    { path: '/create', icon: <FaMagic />, label: 'create' },
    { path: '/delivery', icon: <FaTruck />, label: 'delivery' },
    { path: '/privacy', icon: <FaShieldAlt />, label: 'privacy' },
    { path: '/repair', icon: <FaTools />, label: 'repair' },
    { path: '/guarantee', icon: <FaWrench />, label: 'guarantee' },
  ];

  return (
    <ul className={`hidden sm:flex gap-5 text-sm transition-colors duration-300 ${textColor}`}>
      <NavLink to="/" className="flex flex-col items-center gap-1">
        <p>{t('navbar.menu.home')}</p>
        <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
      </NavLink>

      {/* Catalog Dropdown */}
      <div
        className="relative group"
        onMouseEnter={handleCatalogMouseEnter}
        onMouseLeave={handleCatalogMouseLeave}>
        <NavLink to="/catalog" className="flex flex-col items-center gap-1">
          <p>{t('navbar.menu.catalog')}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
        </NavLink>
        <div
          className={`absolute ${
            isCatalogDropdownVisible ? 'flex' : 'hidden'
          } flex-col bg-white shadow-lg rounded mt-2 w-64 transition-opacity duration-300 opacity-100 z-50`}>
          {categories.map((category) => (
            <div key={category._id} className="flex flex-col">
              <div
                onClick={(event) =>
                  handleCategoryClick(category.slug, category.children.length > 0, event)
                }
                className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer futura">
                <div className="flex items-center">
                  <img src={category.icon} alt={category.name} className="w-8 h-8 mr-2" />
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
                      className="flex items-center px-6 py-2 text-gray-600 hover:bg-gray-100 futura">
                      <img src={subCategory.icon} alt={subCategory.name} className="w-8 h-8 mr-2" />
                      {subCategory.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Services Dropdown */}
      <div
        className="relative group"
        onMouseEnter={handleInfoMouseEnter}
        onMouseLeave={handleInfoMouseLeave}>
        <NavLink to="/service" className="flex flex-col items-center gap-1">
          <p>{t('navbar.menu.service')}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
        </NavLink>
        <div
          className={`absolute ${
            isInfoDropdownVisible ? 'flex' : 'hidden'
          } flex-col bg-white shadow-lg rounded mt-2 w-64 transition-opacity duration-300 opacity-100 z-50`}>
          {serviceLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 futura">
              <div className="flex items-center justify-center w-5 h-5 mr-3 text-mainColor">
                {link.icon}
              </div>
              {t(`navbar.menu.${link.label}`)}
            </NavLink>
          ))}
        </div>
      </div>

      <NavLink to="/contact" className="flex flex-col items-center gap-1">
        <p>{t('navbar.menu.contact')}</p>
        <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
      </NavLink>
    </ul>
  );
};

export default NavbarLinks;
