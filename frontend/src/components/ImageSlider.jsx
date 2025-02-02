import React, { useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white/80 rounded-full p-2">
    <FaChevronLeft className="w-4 h-4" />
  </button>
);

const NextArrow = (props) => (
  <button
    {...props}
    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white/80 rounded-full p-2">
    <FaChevronRight className="w-4 h-4" />
  </button>
);

const ImageSlider = ({ media, productName, isVideo }) => {
  const sliderRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    customPaging: (i) => <button className="w-2 h-2 rounded-full bg-white/50 hover:bg-white" />,
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
          onClick={(e) => {
            if (e.target.paused) {
              e.target.play();
            } else {
              e.target.pause();
            }
          }}>
          <source src={url} type="video/mp4" />
        </video>
      );
    }
    return <img src={url} alt={productName} className="w-full h-full object-cover" />;
  };

  return (
    <div className="relative w-full">
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
