import React from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaQuoteRight, FaUserCircle } from 'react-icons/fa';
import Title from './Title';

const Testimonials = () => {
  const { t } = useTranslation();

  // Keep testimonials in English as they are real customer reviews
  const testimonials = [
    {
      id: 1,
      name: 'John Doe',
      review: 'This jewelry store is amazing! I love the quality and designs.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      review: 'Great customer service and beautiful jewelry. Highly recommended!',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      review: 'I found the perfect ring for my proposal. Thank you!',
    },
    {
      id: 4,
      name: 'Emily Brown',
      review: 'The earrings I bought are stunning. I get compliments all the time.',
    },
    {
      id: 5,
      name: 'David Wilson',
      review: 'Excellent craftsmanship and unique designs. Will definitely buy again.',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1280px] py-8 mx-auto px-4">
        <div className="text-3xl font-bold text-center mb-2 ">
          <Title text1={t('testimonials.title1')} text2={t('testimonials.title2')} />
        </div>
        <p className="text-center futura text-gray-600 mb-12 max-w-2xl mx-auto">
          {t('testimonials.subtitle')}
        </p>

        <div className="max-w-[800px] mx-auto pb-16">
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-6">
                <div className="bg-white rounded-xl shadow-lg p-8 relative transition-transform hover:scale-[1.02] duration-300">
                  <FaQuoteRight className="absolute top-4 right-4 text-pink-100 text-4xl" />
                  <div className="flex items-center mb-6">
                    <div className="bg-gray-400 rounded-full p-1">
                      <FaUserCircle className="text-5xl text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-xl text-gray-800">{testimonial.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    "{testimonial.review}"
                  </p>
                  <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
