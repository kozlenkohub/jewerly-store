import React from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div>
      <div className="max-w-[1280px] mx-auto ">
        <div className="text-center text-2xl pt-20 border-t">
          <Title text1={'Contact'} text2={'Us'} />
        </div>
        <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhd2-0pgJqHAWJLnfraotx9AEVjJk8Bk9gmg&s"
            className="w-full md:max-w-[480px]"
            alt="contact"
          />
          <div className="flex flex-col items-start gap-6 futura-normal">
            <p className="font- text-xl text-mainColor">Our Store</p>
            <p className="text-gray-500 futura">
              г. Киев <br />
              Майдан Незалежности, 1
            </p>
            <p className="text-gray-500 futura">Телефон: +380 44 123 4567</p>
            <p className="text-gray-500 futura">Email: sample@gmail.com</p>
          </div>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Contact;
