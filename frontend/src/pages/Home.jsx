import React from 'react';
import Hero from '../components/Hero';
import LatestCatalog from '../components/LatestCatalog';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import Category from '../components/Category';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <div>
      <Hero />
      <Category />
      <LatestCatalog />
      <OurPolicy />
      <Testimonials />
      <NewsletterBox />
    </div>
  );
};

export default Home;
