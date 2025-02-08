import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar } from 'react-icons/fa';
import RelatedProducts from '../components/RelatedProducts';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import Description from '../components/Description';
import MetalDetails from '../components/MetalDetails';
import SelectSize from '../components/SelectSize';
import ProductDetails from '../components/ProductDetails';
import Loader from '../components/Loader';
import Reviews from '../components/Reviews.jsx';
import ProductGallery from '../components/ProductGallery';
import { useTranslation } from 'react-i18next';
import { localizeField } from '../utils/localizeField';

const Product = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [anotherVariantion, setAnotherVariantion] = useState([]);
  const [activeSize, setActiveSize] = useState(null);
  const [activeMetal, setActiveMetal] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const { currency } = useSelector((state) => state.product);
  const [activeTab, setActiveTab] = useState('description'); // Add this new state

  const updateReviews = (newReview) => {
    setProduct((prev) => ({
      ...prev,
      reviews: [newReview, ...(prev.reviews || [])],
    }));
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < roundedRating ? (
          <FaStar className="text-yellow-500 w-3.5 h-3.5" />
        ) : (
          <FaRegStar className="text-yellow-500 w-3.5 h-3.5" />
        )}
      </span>
    ));
  };

  const isVideo = (url) => url.endsWith('.mp4');

  const renderMedia = (url, className) => {
    if (isVideo(url)) {
      return (
        <video
          className={`${className} cursor-pointer`}
          loop
          muted
          playsInline
          autoPlay={mainImage === url}
          onClick={(e) => {
            if (e.target.paused) {
              e.target.play();
            } else {
              e.target.pause();
            }
          }}>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return <img src={url} alt={localizeField(product.name)} className={className} />;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/get/${params.productId}`, {
          headers: { 'X-Localize': true },
        });

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
    return <Loader />;
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
    <div className="border-t-2 pt-2 sm:pt-12 transition-opacity ease-in duration-500 opacity-100 max-w-[1280px] mx-auto px-4 pb-16">
      <div className="flex gap-12 flex-col md:flex-row">
        <ProductGallery
          product={product}
          mainImage={mainImage}
          setMainImage={setMainImage}
          isVideo={isVideo}
          renderMedia={renderMedia}
        />

        <div className="flex-1 futura">
          <h1 className="font-medium text-2xl mt-2 forum">{localizeField(product.name)}</h1>
          <div className="flex items-center gap-1 mt-2">
            {renderStars(calculateAverageRating(product.reviews))}
            <p className="pl-2">({product.reviews?.length || 0})</p>
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
          <p className="mt-5 text-gray-500 md:w-4/5">{localizeField(product.description)}</p>
          <div className="flex flex-col gap-4 my-8">
            {anotherVariantion.length > 0 && (
              <>
                <p>{t('product.selectMetal')}</p>
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
            <p>{t('product.selectSize')}</p>
            <SelectSize
              sizes={product.size}
              activeSize={activeSize}
              setActiveSize={setActiveSize}
            />
          </div>
          <button
            onClick={handleAddToCart}
            className={`bg-mainColor text-white px-8 py-3 min-w-[145px] text-sm active:bg-mainColor/90`}>
            {t('product.addToCart')}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <ProductDetails />
          </div>
        </div>
      </div>
      {/* Product Details */}
      <div className="mt-8">
        <div className="flex">
          <button
            onClick={() => setActiveTab('description')}
            className={`border px-5 py-3 text-sm ${
              activeTab === 'description' ? 'font-bold bg-gray-50' : ''
            }`}>
            {t('product.description')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`border px-5 py-3 text-sm ${
              activeTab === 'reviews' ? 'font-bold bg-gray-50' : ''
            }`}>
            {t('product.reviews')} ({product.reviews?.length || 0})
          </button>
        </div>
        {activeTab === 'description' ? (
          <Description {...product} />
        ) : (
          <Reviews
            reviews={product.reviews}
            productId={product._id}
            onReviewAdded={updateReviews}
          />
        )}
      </div>
      <RelatedProducts related={related} />
    </div>
  );
};

export default Product;
