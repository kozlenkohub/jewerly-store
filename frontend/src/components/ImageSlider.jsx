import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ImageSlider = ({ media, productName, isVideo }) => {
  const sliderRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (isVideo(media[currentSlide]) && videoRef.current) {
      const video = videoRef.current;
      video.load(); // Принудительная перезагрузка видео

      const playVideo = async () => {
        try {
          await video.play();
        } catch (err) {
          console.error('Video playback failed:', err);
        }
      };

      if (isVideoReady) {
        playVideo();
      }
    }
  }, [currentSlide, isVideoReady, media]);

  const CustomArrow = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className={`absolute ${
        direction === 'prev' ? 'left-2' : 'right-2'
      } top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 z-10`}>
      {direction === 'prev' ? (
        <FaChevronLeft className="w-4 h-4" />
      ) : (
        <FaChevronRight className="w-4 h-4" />
      )}
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    beforeChange: (oldIndex, newIndex) => {
      if (isVideo(media[oldIndex]) && videoRef.current) {
        videoRef.current.pause();
      }
    },
    afterChange: (index) => {
      setCurrentSlide(index);
    },
    customPaging: (i) => <button className={`w-2 h-2 rounded-full bg-white/50 hover:bg-white`} />,
    appendDots: (dots) => (
      <div style={{ position: 'absolute', bottom: '16px', width: '100%' }}>
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
  };

  const renderMedia = (url) => {
    if (isVideo(url)) {
      return (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
          poster={url.replace('.mp4', '.jpg')}
          preload="auto"
          onLoadedMetadata={() => setIsVideoReady(true)}
          onError={(e) => {
            console.error('Video error:', e);
            setIsVideoReady(false);
          }}
          onClick={(e) => {
            if (e.target.paused) {
              e.target.play().catch(console.error);
            } else {
              e.target.pause();
            }
          }}>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return <img src={url} alt={productName} className="w-full h-full object-cover" />;
  };

  return (
    <div className="relative w-full aspect-square">
      <Slider ref={sliderRef} {...settings}>
        {media.map((url, index) => (
          <div key={index} className="aspect-square">
            {renderMedia(url)}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
