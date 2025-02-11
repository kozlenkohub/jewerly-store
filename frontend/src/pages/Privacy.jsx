import React from 'react';
import Title from '../components/Title';
import {
  FaShieldAlt,
  FaUserLock,
  FaCookie,
  FaEnvelope,
  FaLock,
  FaUserSecret,
  FaExclamationTriangle,
  FaHandshake,
} from 'react-icons/fa';
import NewsletterBox from '../components/NewsletterBox';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: <FaUserLock />,
      title: 'dataCollection',
      items: ['personal', 'payment', 'technical', 'usage'],
      color: 'bg-blue-50',
    },
    {
      icon: <FaCookie />,
      title: 'cookies',
      items: ['essential', 'functional', 'analytical', 'advertising'],
      color: 'bg-green-50',
    },
    {
      icon: <FaEnvelope />,
      title: 'dataUsage',
      items: ['orders', 'communication', 'improvement', 'marketing'],
      color: 'bg-purple-50',
    },
    {
      icon: <FaLock />,
      title: 'security',
      items: ['encryption', 'access', 'monitoring', 'compliance'],
      color: 'bg-red-50',
    },
  ];

  const renderSection = ({ icon, title, items, color }) => (
    <div className={`${color} rounded-lg p-6 transition-transform hover:scale-[1.02] text-black `}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl text-mainColor">{icon}</div>
        <h3 className="text-xl font-bold">{t(`privacy.${title}.title`)}</h3>
      </div>
      <p className=" futura mb-4">{t(`privacy.${title}.description`)}</p>
      <ul className="space-y-2  futura">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-mainColor"></div>
            {t(
              `privacy.${title}.${
                title === 'security'
                  ? 'measures'
                  : title === 'dataUsage'
                  ? 'purposes'
                  : title === 'cookies'
                  ? 'types'
                  : 'items'
              }.${item}`,
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Header Section */}
        <div className="text-center py-12 border-b">
          <div className="sm:text-3xl text-xl ">
            <Title text1={t('privacy.title.text1')} text2={t('privacy.title.text2')} />
          </div>
          <div className="max-w-2xl mx-auto mt-6">
            <p className=" futura">{t('privacy.intro.description')}</p>
            <p className="text-sm text-gray-500 mt-4">{t('privacy.intro.lastUpdate')}</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          {sections.map((section) => renderSection(section))}
        </div>

        {/* User Rights Section */}
        <div className="bg-gray-50 rounded-lg p-8 my-12">
          <div className="flex items-center gap-3 mb-6">
            <FaUserSecret className="text-2xl text-mainColor" />
            <h3 className="text-xl font-bold">{t('privacy.rights.title')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['access', 'rectification', 'erasure', 'portability', 'withdraw'].map((right) => (
              <div key={right} className="bg-white p-4 rounded-lg shadow-sm">
                <p className=" futura">{t(`privacy.rights.list.${right}`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Third Parties Section */}
        <div className="my-12">
          <div className="flex items-center gap-3 mb-6">
            <FaHandshake className="text-2xl text-mainColor" />
            <h3 className="text-xl font-bold">{t('privacy.thirdParties.title')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['payment', 'delivery', 'analytics', 'marketing'].map((service) => (
              <div
                key={service}
                className="border p-4 rounded-lg hover:border-mainColor transition-colors">
                <p className=" futura">{t(`privacy.thirdParties.services.${service}`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-mainColor text-white rounded-lg p-8 my-12">
          <div className="flex items-center gap-3 mb-6">
            <FaExclamationTriangle className="text-2xl" />
            <h3 className="text-xl font-bold">{t('privacy.contact.title')}</h3>
          </div>
          <p className="mb-6">{t('privacy.contact.description')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['email', 'phone', 'address'].map((contact) => (
              <div key={contact} className="border border-white/20 p-4 rounded-lg">
                <p className="font-bold mb-2">{t(`privacy.contact.${contact}.label`)}</p>
                <p>{t(`privacy.contact.${contact}.value`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Privacy;
