import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhone } from 'react-icons/fa';

const MobileMenuPhoneNumbers = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center py-3 bg-gray-50">
      <div className="flex items-center space-x-2">
        <FaPhone className="text-mainColor" />
        <p className="text-gray-700 text-sm">{t('mobileMenu.order')}:</p>
      </div>
      <a
        className="text-mainColor font-semibold text-base hover:text-secondaryColor transition-colors"
        href="tel:+48222630353">
        +48 222 630 353
      </a>
      <p className="text-gray-500 text-xs mt-1 futura text-center">{t('mobileMenu.callInfo')}</p>
    </div>
  );
};

export default MobileMenuPhoneNumbers;
