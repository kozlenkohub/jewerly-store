import React from 'react';
import Title from '../components/Title';
import {
  FaRuler,
  FaClock,
  FaRing,
  FaInfoCircle,
  FaExclamationTriangle,
  FaHeart,
} from 'react-icons/fa';
import NewsletterBox from '../components/NewsletterBox';
import { useTranslation } from 'react-i18next';

const Sizes = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 text-black">
        <div className="text-2xl text-center pt-8 border-t">
          <Title text1={t('sizes.title.text1')} text2={t('sizes.title.text2')} />
        </div>

        {/* General Sizing Info */}
        <div className="my-10 flex flex-col md:flex-row gap-16">
          <img
            src="https://example.com/ring-sizing-image.jpg"
            className="w-full md:max-w-[450px] text-mainColor"
            alt={t('sizes.sizingImage')}
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 ubuntu">
            <p>{t('sizes.description.intro')}</p>
            <b className="text-mainColor flex items-center gap-2 playfair">
              <FaRuler /> {t('sizes.generalInfo.title')}
            </b>
            <p>{t('sizes.generalInfo.description')}</p>
          </div>
        </div>

        {/* Ring Width Considerations */}
        <div className="border-t pt-8 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FaRing className="text-mainColor" />
            <h3 className="text-xl font-bold">{t('sizes.width.title')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border p-4">
              <h4 className="font-bold mb-2">{t('sizes.width.narrow.title')}</h4>
              <p className="ubuntu">{t('sizes.width.narrow.description')}</p>
            </div>
            <div className="border p-4">
              <h4 className="font-bold mb-2">{t('sizes.width.wide.title')}</h4>
              <p className="ubuntu">{t('sizes.width.wide.description')}</p>
            </div>
          </div>
        </div>

        {/* Best Time to Measure */}
        <div className="border-t pt-8 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FaClock className="text-mainColor" />
            <h3 className="text-xl font-bold">{t('sizes.timing.title')}</h3>
          </div>
          <div className="ubuntu">
            <p className="mb-4">{t('sizes.timing.description')}</p>
            <ul className="list-disc pl-5">
              <li>{t('sizes.timing.avoid.morning')}</li>
              <li>{t('sizes.timing.avoid.cold')}</li>
              <li>{t('sizes.timing.best')}</li>
            </ul>
          </div>
        </div>

        {/* Surprise Gift Tips */}
        <div className="border-t pt-8 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FaHeart className="text-mainColor" />
            <h3 className="text-xl font-bold">{t('sizes.surprise.title')}</h3>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="list-disc pl-5 ubuntu space-y-2">
              <li>{t('sizes.surprise.tip1')}</li>
              <li>{t('sizes.surprise.tip2')}</li>
            </ul>
          </div>
        </div>

        {/* Important Notes */}
        <div className="border-t pt-8 mb-20">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-mainColor" />
            <h3 className="text-xl font-bold">{t('sizes.notes.title')}</h3>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="ubuntu">{t('sizes.notes.resizing')}</p>
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Sizes;
