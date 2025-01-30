import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const ImageSlider = ({ images, productName }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img className=" object-contain" src={img} alt={productName} />
          </div>
        ))}
      </Slider>
    </>
  );
};

export default ImageSlider;
