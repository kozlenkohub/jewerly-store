import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const NavbarLinks = ({ textColor, categories }) => {
  const { t } = useTranslation();
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
        setDropdownVisible(false);
        setActiveCategory(null);
        navigate(`/catalog/${categorySlug}`);
      }
    },
    [activeCategory, navigate],
  );

  return (
    <ul className={`hidden sm:flex gap-5 text-sm transition-colors duration-300 ${textColor}`}>
      <NavLink to="/" className="flex flex-col items-center gap-1">
        <p>{t('navbar.menu.home')}</p>
        <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
      </NavLink>
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <NavLink to="/catalog" className="flex flex-col items-center gap-1">
          <p>{t('navbar.menu.catalog')}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
        </NavLink>
        <div
          className={`absolute ${
            isDropdownVisible ? 'flex' : 'hidden'
          } flex-col bg-white shadow-lg rounded mt-2 w-64 transition-opacity duration-300 opacity-100`}>
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
      <NavLink to="/about" className="flex flex-col items-center gap-1">
        <p>{t('navbar.menu.about')}</p>
        <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
      </NavLink>
      <NavLink to="/contact" className="flex flex-col items-center gap-1">
        <p>{t('navbar.menu.contact')}</p>
        <hr className="w-2/4 border-none h-[1.5px] bg-mainColor hidden" />
      </NavLink>
    </ul>
  );
};

export default NavbarLinks;
