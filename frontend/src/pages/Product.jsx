import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import { useParams } from 'react-router-dom';
import { DotLoader } from 'react-spinners';

const Product = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/get/${params.productId}`);
        setProduct(data);
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
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1">
          <img src={product.image[0]} alt={product.name} className="w-full h-auto" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          {product.discount > 0 ? (
            <div className="text-xl mb-4">
              <span className="line-through text-red-500 mr-2">${product.price}</span>
              <span>${discountedPrice}</span>
            </div>
          ) : (
            <p className="text-xl mb-4">Price: ${product.price}</p>
          )}
          {product.discount > 0 && (
            <p className="text-xl mb-4 text-red-500">Discount: {product.discount}%</p>
          )}
          <p className="text-lg mb-4">Metal: {product.metal}</p>
          <p className="text-lg mb-4">Carats: {product.carats}</p>
          <p className="text-lg mb-4">Cut Form: {product.cutForm}</p>
          <p className="text-lg mb-4">Description: {product.description}</p>
          <p className="text-lg mb-4">
            Availability: {product.isAvailable ? 'In Stock' : 'Out of Stock'}
          </p>
          {product.bestseller && <p className="text-lg mb-4 text-green-500">Bestseller</p>}
        </div>
      </div>
    </div>
  );
};

export default Product;
