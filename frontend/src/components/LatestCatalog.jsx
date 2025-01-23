import React from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
import { useSelector } from 'react-redux';

import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const LatestCatalog = () => {
  const { products } = useSelector((state) => state.product);
  const [latestProducts, setLatestProducts] = React.useState([]);

  React.useEffect(() => {
    const latest = products.slice(0, 5);
    setLatestProducts(latest);
  }, [products]);

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="text-center py-8 text-3xl">
        <Title text1={'Bestseller '} text2={'Catalog'} />
        <p
          className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600"
          style={{ fontSize: '11px' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus nulla tempora expedita
          laboriosam
        </p>
        <Slider
          dots={true}
          infinite={true}
          speed={10}
          slidesToShow={1}
          slidesToScroll={1}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
              },
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}>
          {latestProducts.map((product) => (
            <ProductItem key={product._id} {...product} />
          ))}
        </Slider>
        <div className="text-center mt-4">
          <a
            href="/cart"
            className="text-[20px] hover:underline transition duration-300 ease-in-out transform hover:scale-105">
            See more
          </a>
        </div>
      </div>
    </div>
  );
};

export default LatestCatalog;
