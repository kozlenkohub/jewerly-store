import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';

function PublicOffer() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="text-2xl text-center pt-8 border-t">
          <Title text1={t('publicOffer.title.text1')} text2={t('publicOffer.title.text2')} />
        </div>

        {/* General Description Section */}
        <div className="my-10">
          <p className="text-gray-600 futura">{t('publicOffer.intro')}</p>
        </div>

        {/* Subject Section */}
        <div className="border-t pt-8 mb-10">
          <h3 className="text-xl font-bold">{t('publicOffer.sections.subject.title')}</h3>
          <p className="text-gray-600 futura">{t('publicOffer.sections.subject.text')}</p>
        </div>

        {/* Payment Section */}
        <div className="border-t pt-8 mb-10">
          <h3 className="text-xl font-bold">{t('publicOffer.sections.payment.title')}</h3>
          <p className="text-gray-600 futura">{t('publicOffer.sections.payment.text')}</p>
        </div>

        {/* Delivery Section */}
        <div className="border-t pt-8 mb-10">
          <h3 className="text-xl font-bold">{t('publicOffer.sections.delivery.title')}</h3>
          <p className="text-gray-600 futura">{t('publicOffer.sections.delivery.text')}</p>
        </div>

        {/* Warranty Section */}
        <div className="border-t pt-8 mb-10">
          <h3 className="text-xl font-bold">{t('publicOffer.sections.warranty.title')}</h3>
          <p className="text-gray-600 futura">{t('publicOffer.sections.warranty.text')}</p>
        </div>

        {/* Final Section */}
        <div className="border-t pt-8 mb-20">
          <h3 className="text-xl font-bold">{t('publicOffer.sections.final.title')}</h3>
          <p className="text-gray-600 futura">{t('publicOffer.sections.final.text')}</p>
        </div>
        {/* Seller Details Section */}
        <div className="border-t pt-8 mb-20">
          <h3 className="text-xl font-bold">{t('publicOffer.details.sellerInfo')}</h3>
          <p className="text-gray-600 futura">{t('publicOffer.details.companyName')}</p>
          <p className="text-gray-600 futura">{t('publicOffer.details.address')}</p>
          <p className="text-gray-600 futura">{t('publicOffer.details.registrationNumber')}</p>
          <p className="text-gray-600 futura">{t('publicOffer.details.bankDetails')}</p>
          <p className="text-gray-600 futura">{t('publicOffer.details.accountNumber')}</p>
          <p className="text-gray-600 futura">{t('publicOffer.details.bankName')}</p>
          <p className="text-gray-600 futura">{t('publicOffer.details.legalCompliance')}</p>
        </div>
      </div>
    </div>
  );
}

export default PublicOffer;
