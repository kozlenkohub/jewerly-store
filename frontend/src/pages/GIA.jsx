import React from 'react';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';
import { FaCertificate, FaQrcode, FaGem, FaBarcode } from 'react-icons/fa';

const GIA = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1280px] min-h-screen mx-auto px-4 py-4">
      {/* Header Section */}
      <div className="text-center py-12 border-b">
        <div className="text-xl sm:text-3xl">
          <Title text1={t('gia.title.text1')} text2={t('gia.title.text2')} />
        </div>
        <div className="max-w-3xl mx-auto mt-6">
          <p className="text-gray-600 futura">{t('gia.intro')}</p>
        </div>
      </div>

      {/* Certificate Value */}
      <div className="my-12">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaQrcode className="text-2xl text-mainColor" />
            <p className="text-gray-600 futura">{t('gia.certificate.value')}</p>
          </div>
        </div>
      </div>

      {/* What is GIA */}
      <div className="my-12">
        <div className="flex items-center gap-3 mb-6">
          <FaCertificate className="text-2xl text-mainColor" />
          <h2 className="text-xl font-bold">{t('gia.what.title')}</h2>
        </div>
        <div className="space-y-4 text-gray-600 futura">
          <p>{t('gia.what.description')}</p>
          <p>{t('gia.what.system')}</p>
        </div>
      </div>

      {/* Laser Marking */}
      <div className="my-12">
        <div className="bg-mainColor text-white rounded-lg p-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaBarcode className="text-2xl" />
            <h3 className="text-xl font-bold">{t('gia.laser.title')}</h3>
          </div>
          <p className="text-center text-lg futura leading-relaxed">{t('gia.laser.description')}</p>
        </div>
      </div>

      {/* Conclusion */}
      <div className="my-12 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaGem className="text-2xl text-mainColor" />
          <h3 className="text-xl font-bold">{t('gia.conclusion.title')}</h3>
        </div>
        <p className="text-gray-600 futura">{t('gia.conclusion.description')}</p>
      </div>
    </div>
  );
};

export default GIA;
