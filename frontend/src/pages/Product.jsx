import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import { useParams } from 'react-router-dom';
import { DotLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaCheckCircle, FaTruck, FaUndo } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';
import RelatedProducts from '../components/RelatedProducts';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const Product = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeSize, setActiveSize] = useState(null);
  const [image, setImage] = useState(0);
  const { currency } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/get/${params.productId}`);
        setProduct(data['product']);
        setRelated(data['relatedProducts']);
        setImage(data['product'].image[0]);
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

  const productDetails = [
    { icon: FaCheckCircle, text: '100% original project' },
    { icon: FaTruck, text: 'Cash on delivery is available on this product.' },
    { icon: FaUndo, text: 'Easy return policy within 7 days.' },
  ];

  return (
    <div className="border-t-2 pt-2 sm:pt-8 transition-opacity ease-in duration-500 opacity-100 max-w-[1280px] mx-auto px-4">
      <div className="flex gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col gap-3 sm:flex-col relative">
          {/* Main Image */}
          <div className="w-full  relative">
            <img
              className="w-full max-h-[500px] sm:max-h-[500px] object-cover"
              src={image}
              alt={product.name}
            />
          </div>

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
          <button
            onClick={() => {
              if (activeSize) {
                console.log('Item ID:', product._id);
                console.log('Size:', activeSize);
                dispatch(addToCart({ product: product._id, size: activeSize }));
              } else {
                toast.error('Please select a size.');
              }
            }}
            className="bg-mainColor text-white px-8 py-3 text-sm active:bg-mainColor/90">
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            {productDetails.map((detail, index) => (
              <p key={index} className="flex items-center gap-2">
                <detail.icon className="inline" />
                {detail.text}
              </p>
            ))}
          </div>
        </div>
      </div>
      {/* Product Details */}
      <div className="mt-20">
        <div className="flex ">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 futura">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem quo repudiandae
            cupiditate! Perferendis unde dicta ad minima, rerum nobis necessitatibus. Lorem ipsum
            dolor, sit amet consectetur adipisicing elit. Repellat nostrum consequatur perspiciatis,
            doloribus ipsa quibusdam est harum veniam illum, nulla totam deleniti asperiores. Nulla,
            facere inventore et ipsum dolorum dolorem!
          </p>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem</p>
        </div>
      </div>
      <RelatedProducts related={related} />
    </div>
  );
};

export default Product;
