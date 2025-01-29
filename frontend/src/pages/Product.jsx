import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import { useParams } from 'react-router-dom';
import { DotLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';

const Product = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [image, setImage] = useState(0);
  const { currency } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/get/${params.productId}`);
        setProduct(data);
        setImage(data.image[0]);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [params.productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <DotLoader size={50} color={'#8c2d60'} loading={!product} speedMultiplier={0.5} />
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="border-t-2 pt-2 sm:pt-8 transition-opacity ease-in duration-500 opacity-100 max-w-[1280px] mx-auto px-4">
      <div className="flex gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col gap-3 sm:flex-col relative">
          {/* Main Image */}
          <div className="w-full border-b relative">
            <img
              className="w-full max-h-[500px] sm:max-h-[500px] object-cover"
              src={image}
              alt={product.name}
            />
          </div>

          {/* Image Slider */}
          <Swiper
            spaceBetween={10}
            slidesPerView={4}
            navigation
            autoplay={{ delay: 3000 }}
            modules={[Navigation, Autoplay]}
            onSlideChange={(swiper) => setImage(product.image[swiper.activeIndex])}
            className="w-full p-2 bg-white/30">
            {product.image.map((img, index) => (
              <SwiperSlide key={index} className="cursor-pointer">
                <img
                  src={img}
                  alt={product.name}
                  className={`w-full sm:max-h-[100px] object-cover rounded-lg transition-opacity duration-300 ${
                    image === img ? 'opacity-90' : 'opacity-60'
                  } hover:opacity-80`}
                  onClick={() => setImage(img)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex-1 futura">
          <h1 className="font-medium text-2xl mt-2 forum">{product.name}</h1>
          <div className="flex items-center gap-1 mt-2 ">
            {[...Array(4)].map((_, index) => (
              <FaStar key={index} className="text-yellow-500 w-3 5" />
            ))}
            <FaRegStar className="text-yellow-500 w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {product.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{product.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap ">
              {product.size.map((size, index) => (
                <button
                  onClick={() => (activeSize === size ? setActiveSize(null) : setActiveSize(size))}
                  key={index}
                  className={`w-10 h-10 aspect-square border border-gray-300 rounded-md flex items-center justify-center ${
                    activeSize === size ? 'bg-mainColor text-white' : ''
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
