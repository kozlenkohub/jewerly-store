import React, { useEffect, useState, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import NavbarLinks from './NavbarLinks';
import NavbarIcons from './NavbarIcons';
import MobileMenu from './MobileMenu';
import { fetchCategories } from '../redux/slices/categorySlice';

const Navbar = () => {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.category.category);

  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCategories());
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isHomePage = location.pathname === '/';
  const backgroundOpacity = isHomePage ? Math.min(scrollY / 300, 1) : 1;
  const textColor = isHomePage && scrollY <= 150 ? 'text-white' : 'text-mainColor';
  const boxShadow = scrollY > 150 ? 'shadow-md' : '';
  const iconColor = isHomePage && scrollY <= 150 ? 'text-white' : 'text-mainColor';
  const bgColor = isHomePage && scrollY <= 150 ? 'bg-white' : 'bg-mainColor';
  const textColor2 = isHomePage && scrollY <= 150 ? 'text-mainColor' : 'text-white';

  return (
    <>
      <div
        className={`z-50 fixed top-0 w-full transition-all ${boxShadow}`}
        style={{ backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})` }}>
        <div className="max-w-[1280px] px-4 mx-auto">
          <div className="flex items-center justify-between py-5 font-medium">
            <Link className={textColor} to="/">
              <p>LOGO</p>
            </Link>
            <NavbarLinks textColor={textColor} categories={categories} />
            <div className="flex items-center gap-6">
              <NavbarIcons iconColor={iconColor} bgColor={bgColor} textColor2={textColor2} />
              <FaBars
                onClick={() => setVisible(true)}
                className={`w-5 h-5 cursor-pointer sm:hidden transition-colors duration-300 ${iconColor}`}
              />
            </div>
            <MobileMenu visible={visible} setVisible={setVisible} categories={categories} />
          </div>
        </div>
      </div>
      {!isHomePage && <div style={{ marginTop: '40px' }}></div>}
    </>
  );
};

export default Navbar;
