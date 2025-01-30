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

  const handleMetalChange = (metalId) => {
    navigate(`/product/${metalId}`);
  };

  return (
    <div className="border-t-2 pt-2 sm:pt-12 transition-opacity ease-in duration-500 opacity-100 max-w-[1280px] mx-auto px-4">
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col gap-3 sm:flex-col relative">
          {/* Main Image */}
          <div className="w-full relative">
            <img
              className="w-full  sm:max-h-[500px] object-contain"
              src={image}
              alt={product.name}
            />
          </div>
          {/* Image Thumbnails */}
          {/* <div className="flex gap-2 mt-2 overflow-x-auto">
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
          </div> */}
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
            onClick={() => {
              dispatch(addToCart({ ...product, size: activeSize }));
            }}
            className="bg-mainColor text-white px-8 py-3 text-sm active:bg-mainColor/90">
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
