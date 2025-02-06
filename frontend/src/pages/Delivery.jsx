import React from 'react';
import Title from '../components/Title';
import {
  FaShippingFast,
  FaCreditCard,
  FaBox,
  FaMapMarkerAlt,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';
import NewsletterBox from '../components/NewsletterBox';
import { useTranslation } from 'react-i18next';

const Delivery = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="text-2xl text-center pt-8 border-t">
          <Title text1={t('delivery.title.text1')} text2={t('delivery.title.text2')} />
        </div>

        {/* General Delivery Info */}
        <div className="my-10 flex flex-col md:flex-row gap-16">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVMr8F6gDqGUfmDFlpZ0oDONiQfxRluQ4APQ&s"
            className="w-full md:max-w-[450px] text-mainColor"
            alt={t('delivery.deliveryImage')}
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 futura">
            <p>{t('delivery.description.part1')}</p>
            <p>{t('delivery.description.part2')}</p>
            <b className="text-mainColor flex items-center gap-2 playfair">
              <FaShippingFast /> {t('delivery.generalInfo.title')}
            </b>
            <p>{t('delivery.generalInfo.description')}</p>
          </div>
        </div>

        {/* Delivery Methods */}
        <div className="text-xl py-4">
          <Title
            text1={t('delivery.methods.title.text1')}
            text2={t('delivery.methods.title.text2')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="border p-6 flex flex-col gap-4">
            <b className="flex items-center gap-2">
              <FaBox /> {t('delivery.methods.standard.title')}
            </b>
            <p className="text-gray-600 futura">{t('delivery.methods.standard.description')}</p>
            <ul className="list-disc pl-5 text-gray-600 futura">
              <li>{t('delivery.methods.standard.time')}</li>
              <li>{t('delivery.methods.standard.cost')}</li>
            </ul>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="border-t pt-8 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-mainColor" />
            <h3 className="text-xl font-bold">{t('delivery.areas.title')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">{t('delivery.areas.domestic.title')}</h4>
              <p className="text-gray-600 futura">{t('delivery.areas.domestic.description')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">{t('delivery.areas.international.title')}</h4>
              <p className="text-gray-600 futura">
                {t('delivery.areas.international.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="border-t pt-8 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FaCreditCard className="text-mainColor" />
            <h3 className="text-xl font-bold">{t('delivery.payment.title')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['card', 'cash', 'online'].map((method) => (
              <div key={method} className="border p-4">
                <h4 className="font-bold mb-2">{t(`delivery.payment.methods.${method}.title`)}</h4>
                <p className="text-gray-600 futura">
                  {t(`delivery.payment.methods.${method}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Times */}
        <div className="border-t pt-8 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FaClock className="text-mainColor" />
            <h3 className="text-xl font-bold">{t('delivery.times.title')}</h3>
          </div>
          <div className="text-gray-600 futura">
            <p className="mb-4">{t('delivery.times.description')}</p>
            <ul className="list-disc pl-5">
              <li>{t('delivery.times.workdays')}</li>
              <li>{t('delivery.times.weekend')}</li>
              <li>{t('delivery.times.holidays')}</li>
            </ul>
          </div>
        </div>

        {/* Important Notes */}
        <div className="border-t pt-8 mb-20">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-mainColor" />
            <h3 className="text-xl font-bold">{t('delivery.notes.title')}</h3>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="list-disc pl-5 text-gray-600 futura space-y-2">
              <li>{t('delivery.notes.tracking')}</li>
              <li>{t('delivery.notes.insurance')}</li>
              <li>{t('delivery.notes.signature')}</li>
              <li>{t('delivery.notes.reschedule')}</li>
            </ul>
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Delivery;
