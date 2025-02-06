import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdCurrencyExchange } from 'react-icons/md';
import { IoDiamond } from 'react-icons/io5';
import { BiSupport } from 'react-icons/bi';

const OurPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base max-w-[1280px] mx-auto  ">
      <div className="">
        <MdCurrencyExchange className="m-auto mb-3 w-12 h-12" />
        <p className="font-semibold">{t('ourPolicy.exchangePolicy.title')}</p>
        <p className="text-gray-400 font-light poppins">
          {t('ourPolicy.exchangePolicy.description')}
        </p>
      </div>
      <div className="">
        <IoDiamond className="m-auto mb-3 w-12 h-12" />
        <p className="font-semibold">{t('ourPolicy.quality.title')}</p>
        <p className="text-gray-400 font-light poppins">{t('ourPolicy.quality.description')}</p>
      </div>
      <div className="">
        <BiSupport className="m-auto mb-3 w-12 h-12" />
        <p className="font-semibold">{t('ourPolicy.support.title')}</p>
        <p className="text-gray-400 font-light poppins">{t('ourPolicy.support.description')}</p>
      </div>
    </div>
  );
};

export default OurPolicy;
