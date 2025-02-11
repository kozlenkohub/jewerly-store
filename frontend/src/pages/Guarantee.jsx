import React from 'react';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';
import {
  FaShieldAlt,
  FaTools,
  FaBan,
  FaExclamationTriangle,
  FaRegCheckCircle,
  FaStar,
} from 'react-icons/fa';

const Guarantee = () => {
  const { t } = useTranslation();

  const careRules = [
    { id: 'fit', icon: <FaRegCheckCircle /> },
    { id: 'activity', icon: <FaRegCheckCircle /> },
    { id: 'beach', icon: <FaRegCheckCircle /> },
    { id: 'chemicals', icon: <FaRegCheckCircle /> },
    { id: 'rhodium', icon: <FaRegCheckCircle /> },
  ];

  return (
    <div className="max-w-[1280px] min-h-screen mx-auto px-4 py-4 text-black ubuntu">
      {/* Header Section */}
      <div className="text-center py-12 border-b">
        <div className="text-xl sm:text-3xl">
          <Title text1={t('guarantee.title.text1')} text2={t('guarantee.title.text2')} />
        </div>
        <div className="max-w-2xl mx-auto mt-6">
          <div className="flex items-center justify-center gap-2 text-mainColor mb-4">
            <FaShieldAlt className="text-2xl" />
            <p className="text-lg font-medium">{t('guarantee.duration')}</p>
          </div>
          <p className="">{t('guarantee.intro')}</p>
        </div>
      </div>

      {/* Covered Section */}
      <div className="my-12">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaTools className="text-2xl text-mainColor" />
            <h3 className="text-xl font-bold">{t('guarantee.covered.title')}</h3>
          </div>
          <p className="">{t('guarantee.covered.description')}</p>
        </div>
      </div>

      {/* Not Covered Section */}
      <div className="my-12">
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaBan className="text-2xl text-mainColor" />
            <h3 className="text-xl font-bold">{t('guarantee.notCovered.title')}</h3>
          </div>
          <ul className="space-y-2">
            {['mechanical', 'repair', 'misuse', 'chemical'].map((item) => (
              <li key={item} className="flex items-center gap-2 ">
                <div className="w-1.5 h-1.5 rounded-full bg-mainColor"></div>
                {t(`guarantee.notCovered.items.${item}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 rounded-lg p-6 my-12">
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-2xl text-mainColor" />
          <h3 className="text-xl font-bold">{t('guarantee.important.title')}</h3>
        </div>
        <p className="">{t('guarantee.important.description')}</p>
      </div>

      {/* Care Instructions */}
      <div className="my-12">
        <div className="flex items-center gap-3 mb-6">
          <FaStar className="text-2xl text-mainColor" />
          <h3 className="text-xl font-bold">{t('guarantee.care.title')}</h3>
        </div>
        <p className=" mb-6">{t('guarantee.care.description')}</p>
        <ul className="space-y-4">
          {careRules.map((rule) => (
            <li key={rule.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <span className="text-mainColor">{rule.icon}</span>
              <p className="">{t(`guarantee.care.rules.${rule.id}`)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Conclusion */}
      <div className="bg-mainColor text-white rounded-lg p-8 my-12">
        <p className="text-center text-lg leading-relaxed">{t('guarantee.conclusion')}</p>
      </div>
    </div>
  );
};

export default Guarantee;
