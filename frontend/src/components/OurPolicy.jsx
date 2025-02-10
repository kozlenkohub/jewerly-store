import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoDiamond } from 'react-icons/io5';
import { GiDiamondRing } from 'react-icons/gi';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

const OurPolicy = () => {
  const { t } = useTranslation();

  const policies = [
    {
      Icon: IoIosCheckmarkCircleOutline,
      translationKey: 'exchangePolicy',
    },
    {
      Icon: IoDiamond,
      translationKey: 'quality',
    },
    {
      Icon: GiDiamondRing,
      translationKey: 'support',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base max-w-[1280px] mx-auto">
      {policies.map(({ Icon, translationKey }) => (
        <div key={translationKey} className="">
          <Icon className="m-auto mb-3 w-12 h-12" />
          <p className="font-semibold">{t(`ourPolicy.${translationKey}.title`)}</p>
          <p className="text-gray-400 font-light futura">
            {t(`ourPolicy.${translationKey}.description`)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;
