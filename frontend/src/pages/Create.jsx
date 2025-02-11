import React from 'react';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt, FaCube, FaLayerGroup, FaSnowflake, FaGem, FaClock } from 'react-icons/fa';

const Create = () => {
  const { t } = useTranslation();

  const stages = [
    { id: 'idea', icon: <FaPencilAlt />, color: 'bg-blue-50' },
    { id: 'model', icon: <FaCube />, color: 'bg-purple-50' },
    { id: 'visualization', icon: <FaLayerGroup />, color: 'bg-green-50' },
    { id: 'replica', icon: <FaSnowflake />, color: 'bg-yellow-50' },
    { id: 'production', icon: <FaGem />, color: 'bg-red-50' },
  ];

  return (
    <div className="max-w-[1280px] min-h-screen mx-auto px-4 py-4">
      {/* Header Section */}
      <div className="text-center py-12 border-b">
        <div className="text-xl sm:text-3xl">
          <Title text1={t('create.title.text1')} text2={t('create.title.text2')} />
        </div>
        <div className="max-w-2xl mx-auto mt-6">
          <p className="text-gray-600 ubuntu">{t('create.intro')}</p>
        </div>
      </div>

      {/* Production Time */}
      <div className="flex items-center justify-center gap-2 my-8 text-mainColor">
        <FaClock className="text-xl" />
        <p className="text-lg font-medium">{t('create.productionTime')}</p>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`${stage.color} rounded-lg p-6 transition-all hover:shadow-lg hover:scale-[1.02]`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl text-mainColor">{stage.icon}</div>
              <h3 className="text-xl font-bold">{t(`create.stages.${stage.id}.title`)}</h3>
            </div>
            <p className="text-gray-600 ubuntu">{t(`create.stages.${stage.id}.description`)}</p>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <div className="bg-mainColor text-white rounded-lg p-8 my-8">
        <p className="text-center text-lg ubuntu leading-relaxed">{t('create.conclusion')}</p>
      </div>
    </div>
  );
};

export default Create;
