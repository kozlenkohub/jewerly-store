import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { DotLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaCheckCircle, FaTruck, FaUndo } from 'react-icons/fa';
import RelatedProducts from '../components/RelatedProducts';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import Description from '../components/Description';

const Product = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [anotherVariantion, setAnotherVariantion] = useState([]);
  const [activeSize, setActiveSize] = useState(null);
  const [image, setImage] = useState(0);
  const [activeMetal, setActiveMetal] = useState(null);
  const { currency } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/get/${params.productId}`);
        setProduct(data['product']);
        setRelated(data['relatedProducts']);
        setAnotherVariantion(data['anotherVariation']);
        setImage(data['product'].image[0]);
        setActiveMetal(data['product'].metal || data['anotherVariation'][0]?.metal || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [params.productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <DotLoader size={50} color={'#1F3A63'} loading={!product} speedMultiplier={0.5} />
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  const productDetails = [
    { icon: FaCheckCircle, text: '100% original project' },
    { icon: FaTruck, text: 'Cash on delivery is available on this product.' },
    { icon: FaUndo, text: 'Easy return policy within 7 days.' },
  ];

  const metalDetails = [
    {
      label: 'yellow gold',
      icon: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/zheltoe-zoloto.png',
    },
    {
      label: 'rose gold',
      icon: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/krasnoe-zoloto.png',
    },
    {
      label: 'white gold',
      icon: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/beloe-zoloto.png',
    },
  ];

  const handleMetalChange = (metalId) => {
    navigate(`/product/${metalId}`);
  };

  return (
    <div className="border-t-2 pt-2 sm:pt-12 transition-opacity ease-in duration-500 opacity-100 max-w-[1280px] mx-auto px-4">
      <div className="flex gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col gap-3 sm:flex-col relative">
          {/* Main Image */}
          <div className="w-full relative">
            <img
              className="w-full max-h-[500px] sm:max-h-[500px] object-cover"
              src={image}
              alt={product.name}
            />
          </div>
          {/* Image Thumbnails */}
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {product.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={product.name}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-opacity duration-300 ${
                  image === img ? 'opacity-90' : 'opacity-60'
                } hover:opacity-80`}
                onClick={() => setImage(img)}
              />
            ))}
          </div>
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
            {product.discount ? (
              <>
                <span className="line-through text-gray-500 text-base mr-2">
                  {product.price} {currency}
                </span>
                {discountedPrice} {currency}
              </>
            ) : (
              <>
                {product.price} {currency}
              </>
            )}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{product.description}</p>
          <div className="flex flex-col gap-4 my-8">
            {anotherVariantion.length > 0 && (
              <>
                <p>Select Metal</p>
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
                  {[{ _id: params.productId, metal: product.metal }, ...anotherVariantion].map(
                    (variation, index) => (
                      <button
                        onClick={() => {
                          if (variation._id !== params.productId) {
                            handleMetalChange(variation._id);
                            setProduct(null);
                          }
                        }}
                        key={index}
                        className={`w-10 h-10 aspect-square  border-gray-300 rounded-md flex items-center justify-center ${
                          activeMetal === variation.metal
                            ? 'border-mainColor border-[3px] box-border'
                            : ''
                        }`}>
                        <img
                          className="rounded-md"
                          src={metalDetails.find((metal) => metal.label === variation.metal)?.icon}
                          alt={variation.metal}
                        />
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
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
              dispatch(addToCart({ ...product, size: activeSize }));
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
        <Description {...product} />
      </div>
      <RelatedProducts related={related} />
    </div>
  );
};

export default Product;
