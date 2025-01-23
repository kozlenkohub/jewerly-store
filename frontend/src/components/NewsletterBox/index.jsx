import React from 'react';
import './NewsletterBox.css'; // Импортируем файл стилей

const NewsletterBox = () => {
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="newsletter-box text-center">
      <p className="text-2xl font-medium text-gray-800">Subscribe now & get 20% off</p>
      <p className="text-gray-400 mt-3">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
      <form
        onSubmit={onSubmit}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6  pl-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full sm:flex-1 outline-none bg-white/40 text-black  border-mainColor py-2"
          required
        />
        <button type="submit" className="bg-mainColor text-white text-xs px-10 py-4">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
