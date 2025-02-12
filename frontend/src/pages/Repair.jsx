import React from 'react';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';
import { FaLock, FaGem, FaLink, FaWrench, FaPaintBrush } from 'react-icons/fa';

const Repair = () => {
  const { t } = useTranslation();

  const services = [
    { id: 'locks', icon: <FaLock /> },
    { id: 'polish', icon: <FaWrench /> },
    { id: 'stones', icon: <FaGem /> },
    { id: 'chains', icon: <FaLink /> },
    { id: 'rhodium', icon: <FaPaintBrush /> },
  ];

  return (
    <div className="max-w-[1280px]  mx-auto px-4 py-4 text-black ">
      {/* Header Section */}
      <div className="text-center py-2 border-b">
        <div className="text-xl sm:text-3xl">
          <Title text1={t('repair.title.text1')} text2={t('repair.title.text2')} />
        </div>
        <div className="max-w-2xl mx-auto mt-6">
          <p className="ubuntu">{t('repair.intro')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="my-12">
        <p className=" ubuntu mb-4">{t('repair.description')}</p>
        <ul className="list-none  ubuntu">
          {services.map((service) => (
            <li key={service.id} className="flex items-center gap-2 mb-2">
              <span className="text-mainColor">{service.icon}</span>
              {t(`repair.services.${service.id}`)}
            </li>
          ))}
        </ul>
      </div>

      {/* Value Section */}
      <div className="my-12 bg-gray-50 rounded-lg p-6">
        <p className=" ubuntu">{t('repair.value')}</p>
      </div>

      {/* Conclusion */}
      <div className="bg-mainColor text-white rounded-lg p-8 my-12">
        <p className="text-center text-lg ubuntu leading-relaxed">{t('repair.conclusion')}</p>
      </div>
    </div>
  );
};

export default Repair;
