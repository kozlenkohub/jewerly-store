import React, { useState, useEffect, useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ImageSlider = ({ media, productName, isVideo, renderMedia }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidePosition, setSlidePosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    // Play video if current media is video
    if (isVideo(media[currentIndex]) && videoRef.current) {
      videoRef.current.play();
    }
  }, [currentIndex, media, isVideo]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? media.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === media.length - 1 ? 0 : prevIndex + 1));
  };

  const renderMediaWithRef = (url, className) => {
    if (isVideo(url)) {
      return (
        <video
          ref={videoRef}
          className={className}
          loop
          muted
          playsInline
          poster={url.replace('.mp4', '.jpg')} // Add poster image
          preload="auto" // Preload the video
          onClick={(e) => {
            if (e.target.paused) {
              e.target.play();
            } else {
              e.target.pause();
            }
          }}>
          <source src={url} type="video/mp4" />
        </video>
      );
    }
    return <img src={url} alt={productName} className={className} />;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current || !isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    setSlidePosition(-diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const threshold = 50;

    if (Math.abs(slidePosition) > threshold) {
      if (slidePosition > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    setSlidePosition(0);
    touchStartX.current = null;
  };

  return (
    <div className="relative w-full">
      <div
        className="aspect-square overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <div
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${slidePosition}px)`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}>
          {renderMediaWithRef(media[currentIndex], 'w-full h-full object-cover')}
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2">
        <FaChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2">
        <FaChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {media.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
