import React from 'react';
import Title from '../components/Title';
import { FaInfoCircle, FaCheckCircle, FaThumbsUp } from 'react-icons/fa';
import NewsletterBox from '../components/NewsletterBox';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="text-2xl text-center pt-8 border-t text-blacks">
          <Title text1={t('about.title.text1')} text2={t('about.title.text2')} />
        </div>
        <div className="my-10 flex flex-col md:flex-row gap-16">
          <img
            src="https://media.timeout.com/images/102035297/image.jpg"
            className="w-full md:max-w-[450px] text-mainColor"
            alt={t('about.storeImage')}
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4  futura">
            <p className="">{t('about.description.part1')}</p>
            <p className="">{t('about.description.part2')}</p>
            <b className="text-mainColor flex items-center gap-2 playfair">
              <FaInfoCircle /> {t('about.mission.title')}
            </b>
            <p>{t('about.mission.description')}</p>
          </div>
        </div>
        <div className="text-xl py-4">
          <Title
            text1={t('about.whyChooseUs.title.text1')}
            text2={t('about.whyChooseUs.title.text2')}
          />
        </div>
        <div className="flex flex-col md:flex-row text-sm mb-20">
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="flex items-center gap-2">
              <FaCheckCircle /> {t('about.whyChooseUs.quality.title')}
            </b>
            <p className=" futura">{t('about.whyChooseUs.quality.description')}</p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="flex items-center gap-2">
              <FaThumbsUp /> {t('about.whyChooseUs.convenience.title')}
            </b>
            <p className=" futura">{t('about.whyChooseUs.convenience.description')}</p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="flex items-center gap-2">
              <FaInfoCircle /> {t('about.whyChooseUs.service.title')}
            </b>
            <p className=" futura">{t('about.whyChooseUs.service.description')}</p>
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
