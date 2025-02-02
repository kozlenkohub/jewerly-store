import React from 'react';
import ImageSlider from './ImageSlider';

const ProductGallery = ({ product, mainImage, setMainImage, isVideo, renderMedia }) => {
  return (
    <>
      <div className="flex-1 flex flex-col gap-3 relative px-3 mt-5 md:hidden">
        <ImageSlider
          media={product.image}
          productName={product.name}
          isVideo={isVideo}
          renderMedia={renderMedia}
        />
      </div>
      <div className="hidden md:flex flex-1 flex-col gap-3">
        <div className="relative">
          {renderMedia(mainImage, 'w-full h-auto object-cover')}
          <div className="absolute left-[10%] bottom-0 p-2 flex w-[40%] gap-2 bg-opacity-50">
            {product.image.map((media, index) => (
              <div
                key={index}
                className={`relative w-[50%] cursor-pointer border-2 transition-all duration-300 ${
                  mainImage === media
                    ? 'border-mainColor/40 scale-110'
                    : 'opacity-50 hover:opacity-75 hover:scale-105'
                }`}
                onClick={() => setMainImage(media)}>
                {renderMedia(media, 'w-full h-full object-cover')}
                {isVideo(media) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5-7-5z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductGallery;
