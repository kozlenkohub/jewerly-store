import React from 'react';

import Title from './Title';
import { category } from '../assets/assets';
import { useSelector } from 'react-redux';

const Category = () => {
  // const { category } = useSelector((state) => state.category);
  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="text-center py-8 text-3xl">
        <Title text1={'Our'} text2={'Categories'} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-0 gap-y-6 mt-6">
          {category.map((category) => (
            <div
              key={category._id}
              className="p-2 transform transition-transform duration-300 cursor-pointer ">
              <div className="h-40 w-full relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-opacity duration-300 hover:opacity-75 hover:filter hover:grayscale"
                />
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-15 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg text-textColor mt-2 poppins font-light tracking-widest">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
