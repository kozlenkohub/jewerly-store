import React from 'react';
import Hero from '../components/Hero';
import LatestCatalog from '../components/LatestCatalog';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCatalog />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
