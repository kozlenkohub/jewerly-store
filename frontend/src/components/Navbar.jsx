import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import NavbarLinks from './NavbarLinks';
import NavbarIcons from './NavbarIcons';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const categories = [
    {
      id: 1,
      name: 'Category 1',
      icon: 'https://placeholder.pics/svg/48',
      childrens: [
        {
          id: 11,
          icon: 'https://placeholder.pics/svg/48',
          name: 'Sub Category 1',
        },
      ],
    },
    {
      id: 2,
      name: 'Category 2',
      icon: 'https://placeholder.pics/svg/48',
      childrens: [
        {
          id: 12,
          icon: 'https://placeholder.pics/svg/48',
          name: 'Sub Category 1',
        },
      ],
    },
    { id: 3, name: 'Category 3', icon: 'https://placeholder.pics/svg/48' },
    { id: 4, name: 'Category 4', icon: 'https://placeholder.pics/svg/48' },
    { id: 5, name: 'Category 5' },
  ];
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
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
  const textColor = isHomePage && scrollY <= 150 ? 'text-white' : 'text-gray-700';
  const boxShadow = scrollY > 150 ? 'shadow-md' : '';
  const iconColor = isHomePage && scrollY <= 150 ? 'text-white' : 'text-mainColor';

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
              <NavbarIcons iconColor={iconColor} />
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
