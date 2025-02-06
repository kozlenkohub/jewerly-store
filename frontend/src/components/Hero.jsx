import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import video from '../assets/promo.webm';

const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      // Попытка воспроизведения видео
      const handleVideoPlayback = async () => {
        try {
          await videoElement.play();
        } catch (error) {
          console.error('Не удалось воспроизвести видео:', error);
        }
      };

      // Обработчик события загрузки видео
      const handleCanPlay = () => {
        handleVideoPlayback();
      };

      videoElement.addEventListener('canplaythrough', handleCanPlay);

      return () => {
        videoElement.removeEventListener('canplaythrough', handleCanPlay);
      };
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        src={video}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}>
        <source src={video} type="video/webm" />
        {t('hero.videoFallback')}
      </video>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          color: 'white',
          textAlign: 'center',
        }}>
        <h1
          className="playfair"
          style={{
            fontSize: '3rem',
            margin: '0.5rem',
            borderBottom: '2px solid white',
            animation: 'borderExpand 2.1s forwards',
          }}>
          The Queen's diamond
        </h1>
        <p className="font-light futura" style={{ fontSize: '13px', margin: '0.5rem' }}>
          {t('hero.subtitle')}
        </p>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <div style={{ animation: 'bounce 2s infinite' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ width: '24px', height: '24px', color: 'white' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Hero;
