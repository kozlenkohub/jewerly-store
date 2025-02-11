import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaInstagram, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isContactsDropdownOpen, setIsContactsDropdownOpen] = useState(false);

  const toggleCompanyDropdown = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
  };

  const toggleContactsDropdown = () => {
    setIsContactsDropdownOpen(!isContactsDropdownOpen);
  };

  const companyLinks = [
    { name: t('footer.company.links.0'), path: '/' },
    { name: t('footer.company.links.1'), path: '/about' },
    { name: t('footer.company.links.2'), path: '/delivery' },
    { name: t('footer.company.links.3'), path: '/privacy' },
    { name: t('footer.company.links.4'), path: '/public-offer' },
  ];

  const contactLinks = [
    {
      name: t('footer.contacts.links.0'),
      path: 'https://instagram.com',
      isExternal: true,
      icon: <FaInstagram className="text-lg" />,
    },
    {
      name: t('footer.contacts.links.1'),
      path: 'tel:+380633733013',
      icon: <FaPhone className="text-lg" />,
    },
    {
      name: t('footer.contacts.links.2'),
      path: 'mailto:test@gmail.com',
      icon: <FaEnvelope className="text-lg" />,
    },
  ];

  const renderLink = (link, index) => {
    if (link.isExternal) {
      return (
        <a
          href={link.path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-white transition-colors">
          {link.icon}
          {link.name}
        </a>
      );
    }

    if (link.path.startsWith('tel:') || link.path.startsWith('mailto:')) {
      return (
        <a href={link.path} className="flex items-center gap-2 hover:text-white transition-colors">
          {link.icon}
          {link.name}
        </a>
      );
    }

    return (
      <Link to={link.path} className="hover:text-white transition-colors">
        {link.name}
      </Link>
    );
  };

  return (
    <div className="bg-mainColor">
      <div className="flex pt-10 flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-4 mb-7 text-sm max-w-[1280px] mx-auto px-4">
        <div className="">
          <Link to="/" className="block">
            <p className="text-2xl text-white mb-2">LOGO</p>
          </Link>
          <p className="w-full md:w-2/3 text-slate-300 font-light poppins text-[12px]">
            {t('footer.description')}
          </p>
        </div>
        <div className="">
          <div
            className="flex items-center justify-between text-xl font-medium mb-2 text-white cursor-pointer sm:cursor-default"
            onClick={toggleCompanyDropdown}>
            <span>{t('footer.company.title')}</span>
            <FaChevronDown
              className={`transition-transform sm:hidden ${
                isCompanyDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          {(isCompanyDropdownOpen || window.innerWidth >= 640) && (
            <ul className="flex flex-col gap-1 text-slate-300 font-light poppins">
              {companyLinks.map((link, index) => (
                <li key={index}>{renderLink(link, index)}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div
            className="flex items-center justify-between text-xl font-medium mb-2 text-white cursor-pointer sm:cursor-default"
            onClick={toggleContactsDropdown}>
            <span>{t('footer.contacts.title')}</span>
            <FaChevronDown
              className={`transition-transform sm:hidden ${
                isContactsDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
          {(isContactsDropdownOpen || window.innerWidth >= 640) && (
            <ul className="flex flex-col gap-1 text-slate-300 font-light poppins">
              {contactLinks.map((link, index) => (
                <li key={index}>{renderLink(link, index)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="">
        <hr />
        <p className="py-3 text-sm text-center text-white font-light poppins">
          {t('footer.copyright')}
        </p>
      </div>
    </div>
  );
};

export default Footer;
