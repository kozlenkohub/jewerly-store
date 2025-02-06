import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import video from '../../assets/night.webm'; // Импортируем видео
import './NewsletterBox.css'; // Импортируем файл стилей

const NewsletterBox = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.warn('Не удалось воспроизвести видео:', error);
          videoRef.current.muted = true; // Принудительное отключение звука для iOS
          try {
            await videoRef.current.play();
          } catch (secondError) {
            console.error('Видео всё ещё не воспроизводится:', secondError);
          }
        }
      }
    };

    playVideo();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="newsletter-box text-center mb-16">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className="video-background">
        <source src={video} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay">
        <p className="text-2xl font-medium text-white">{t('newsletterBox.title')}</p>
        <p className="text-white mt-3">{t('newsletterBox.description')}</p>
        <form
          onSubmit={onSubmit}
          className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 pl-3">
          <input
            type="email"
            placeholder={t('newsletterBox.emailPlaceholder')}
            className="w-full sm:flex-1 outline-none bg-white text-black border-2 border-mainColor/40 py-2"
            required
          />
          <button type="submit" className="bg-mainColor text-white text-xs px-10 py-4">
            {t('newsletterBox.buttonText')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterBox;
