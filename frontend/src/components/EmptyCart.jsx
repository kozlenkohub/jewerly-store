import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { FaGem } from 'react-icons/fa';

const EmptyCart = () => {
  const ringRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(ringRef.current, {
      scale: 0,
      rotation: 360,
      duration: 1,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[88.7vh] -translate-y-12 text-center futura">
      <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
      <div ref={ringRef} className="mb-6">
        <FaGem className="text-6xl text-mainColor" />
      </div>
      <p className="text-gray-600 text-sm max-w-[400px] mx-auto">
        Looks like you haven’t added any items yet. Start exploring our beautiful jewelry
        collection!
      </p>
      <button
        onClick={() => navigate('/catalog')}
        className="bg-mainColor text-white text-sm px-6 py-2 mt-4">
        Go to Catalog
      </button>
      {/* ...existing code... */}
    </div>
  );
};

export default EmptyCart;
