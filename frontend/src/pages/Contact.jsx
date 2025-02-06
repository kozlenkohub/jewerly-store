import React from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="max-w-[1280px] mx-auto ">
        <div className="text-center text-2xl pt-8 border-t">
          <Title text1={t('contact.title.text1')} text2={t('contact.title.text2')} />
        </div>
        <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhd2-0pgJqHAWJLnfraotx9AEVjJk8Bk9gmg&s"
            className="w-full md:max-w-[480px]"
            alt={t('contact.storeImage')}
          />
          <div className="flex flex-col items-start gap-6 futura-normal">
            <p className="font- text-xl text-mainColor">{t('contact.store')}</p>
            <p className="text-gray-500 futura">
              {t('contact.address.city')} <br />
              {t('contact.address.street')}
            </p>
            <p className="text-gray-500 futura">{t('contact.phone')}</p>
            <p className="text-gray-500 futura">{t('contact.email')}</p>
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Contact;
