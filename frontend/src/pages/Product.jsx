import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { DotLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar } from 'react-icons/fa';
import RelatedProducts from '../components/RelatedProducts';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import Description from '../components/Description';
import MetalDetails from '../components/MetalDetails';
import SelectSize from '../components/SelectSize';
import ProductDetails from '../components/ProductDetails';
import ImageSlider from '../components/ImageSlider';

const Product = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [anotherVariantion, setAnotherVariantion] = useState([]);
  const [activeSize, setActiveSize] = useState(null);
  const [activeMetal, setActiveMetal] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const { currency } = useSelector((state) => state.product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/get/${params.productId}`);
        setProduct(data['product']);
        setRelated(data['relatedProducts']);
        setAnotherVariantion(data['anotherVariation']);
        setMainImage(data['product'].image[0]);
        setActiveMetal(data['product'].metal || data['anotherVariation'][0]?.metal || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [params.productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen pb-36">
        <DotLoader size={50} color={'#1F3A63'} loading={!product} speedMultiplier={0.5} />
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  const handleMetalChange = (metalId) => {
    navigate(`/product/${metalId}`);
  };

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ ...product, size: activeSize }));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="border-t-2 pt-2 sm:pt-12 transition-opacity ease-in duration-500 opacity-100 max-w-[1280px] mx-auto px-4">
      <div className="flex gap-12 flex-col md:flex-row">
        <div className="flex-1 flex flex-col gap-3 relative px-3 mt-5 md:hidden">
          <ImageSlider images={product.image} productName={product.name} />
        </div>
        <div className="hidden md:flex flex-1 flex-col gap-3 ">
          <div className="relative">
            <img src={mainImage} alt={product.name} className="w-full h-auto object-cover" />
            <div className="absolute  left-[10%] bottom-0  p-2 flex w-[40%] gap-2 bg-opacity-50">
              {product.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-[50%] object-cover cursor-pointer border-2 transition-all duration-300 ${
                    mainImage === img
                      ? 'border-mainColor/40 scale-110' // добавление выделения для активного изображения
                      : 'opacity-50 hover:opacity-75 hover:scale-105'
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
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
                <MetalDetails
                  productId={params.productId}
                  product={product}
                  anotherVariantion={anotherVariantion}
                  activeMetal={activeMetal}
                  handleMetalChange={handleMetalChange}
                  setProduct={setProduct}
                />
              </>
            )}
            <p>Select Size</p>
            <SelectSize
              sizes={product.size}
              activeSize={activeSize}
              setActiveSize={setActiveSize}
            />
          </div>
          <button
            onClick={handleAddToCart}
            className={`bg-mainColor text-white px-8 py-3 min-w-[145px] text-sm active:bg-mainColor/90`}>
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <ProductDetails />
          </div>
        </div>
      </div>
      {/* Product Details */}
      <div className="mt-8">
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
