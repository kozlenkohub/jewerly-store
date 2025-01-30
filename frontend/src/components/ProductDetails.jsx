import React from 'react';
import { FaCheckCircle, FaTruck, FaUndo } from 'react-icons/fa';

const ProductDetails = () => {
  const productDetails = [
    { icon: FaCheckCircle, text: '100% original project' },
    { icon: FaTruck, text: 'Cash on delivery is available on this product.' },
    { icon: FaUndo, text: 'Easy return policy within 7 days.' },
  ];

  return (
    <>
      {productDetails.map((detail, index) => (
        <p key={index} className="flex items-center gap-2">
          <detail.icon className="inline" />
          {detail.text}
        </p>
      ))}
    </>
  );
};

export default ProductDetails;
