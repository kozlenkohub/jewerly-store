import React from 'react';
import video from '../../assets/night.webm'; // Импортируем видео
import './NewsletterBox.css'; // Импортируем файл стилей

const NewsletterBox = () => {
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="newsletter-box text-center">
      <video autoPlay muted loop>
        <source src={video} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay">
        <p className="text-2xl font-medium text-white">Subscribe now & get 20% off</p>
        <p className="text-white mt-3">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
        <form
          onSubmit={onSubmit}
          className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6  pl-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full sm:flex-1 outline-none bg-white/70 text-black border-mainColor py-2" // Adjusted background opacity
            required
          />
          <button type="submit" className="bg-mainColor text-white text-xs px-10 py-4">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterBox;
