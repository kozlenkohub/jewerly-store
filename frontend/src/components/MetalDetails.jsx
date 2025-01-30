import React from 'react';
import { useNavigate } from 'react-router-dom';

const MetalDetails = ({
  productId,
  product,
  anotherVariantion,
  activeMetal,
  handleMetalChange,
  setProduct,
}) => {
  const navigate = useNavigate();

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

  return (
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
      {[{ _id: productId, metal: product.metal }, ...anotherVariantion].map((variation, index) => (
        <button
          onClick={() => {
            if (variation._id !== productId) {
              handleMetalChange(variation._id);
              setProduct(null);
            }
          }}
          key={index}
          className={`w-10 h-10 aspect-square  border-gray-300 rounded-md flex items-center justify-center ${
            activeMetal === variation.metal ? 'border-mainColor border-[3px] box-border' : ''
          }`}>
          <img
            className="rounded-md"
            src={metalDetails.find((metal) => metal.label === variation.metal)?.icon}
            alt={variation.metal}
          />
        </button>
      ))}
    </div>
  );
};

export default MetalDetails;
