import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ImageSlider = ({ media, productName, isVideo }) => {
  const videoRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const CustomArrow = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className={`absolute ${
        direction === 'prev' ? 'left-1' : 'right-1'
      } top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 z-10 shadow-md hover:bg-white`}>
      {direction === 'prev' ? (
        <FaChevronLeft className="w-4 h-4" />
      ) : (
        <FaChevronRight className="w-4 h-4" />
      )}
    </button>
  );

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    beforeChange: (oldIndex) => {
      if (isVideo(media[oldIndex]) && videoRef.current) {
        videoRef.current.pause();
      }
    },
    afterChange: setCurrentSlide,
    customPaging: () => <button className="w-2 h-2 rounded-full bg-white/50 hover:bg-white" />,
    appendDots: (dots) => (
      <div style={{ position: 'absolute', bottom: '16px', width: '100%' }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
  };

  const renderMedia = (url) => {
    if (isVideo(url)) {
      return (
        <div className="relative w-full h-full">
          {isLoading && <LoadingSpinner />}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            autoPlay
            preload="auto"
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={() => setIsLoading(false)}>
            <source src={url.split('#')[0]} type="video/mp4" />
          </video>
        </div>
      );
    }
    return <img src={url} alt={productName} className="w-full h-full object-cover" />;
  };

  return (
    <div className="relative w-full aspect-square">
      <Slider {...settings}>
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
