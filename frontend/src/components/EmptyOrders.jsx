import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const EmptyOrders = () => {
  const ringRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(ringRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[95.5vh] -translate-y-12 text-center futura">
      <h2 className="text-2xl font-bold mb-4">You have no orders</h2>
      <div ref={ringRef} className="mb-6">
        <FaShoppingCart className="text-6xl text-mainColor" />
      </div>
      <p className="text-gray-600 text-sm max-w-[400px] mx-auto">
        Looks like you haven’t placed any orders yet. Start exploring our beautiful jewelry
        collection!
      </p>
      <button
        onClick={() => navigate('/catalog')}
        className="bg-mainColor text-white text-sm px-6 py-2 mt-4">
        Go to Catalog
      </button>
    </div>
  );
};

export default EmptyOrders;
