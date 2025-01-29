import React from 'react';
import Title from '../components/Title';

const Checkout = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'Delivery'} text2={'Information'} />
        </div>
        <div className="flex gap-3 "></div>
      </div>
    </div>
  );
};

export default Checkout;
