import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from './Title';
import ProductItem from './ProductItem';
import { products } from '../assets/assets';
import { Link } from 'react-router-dom';

const LatestCatalog = () => {
  const { t } = useTranslation();
  const [latestProducts, setLatestProducts] = React.useState([]);

  React.useEffect(() => {
    const latest = products.slice(0, 5);
    setLatestProducts(latest);
  }, [products]);

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="text-center py-8 text-3xl">
        <Title text1={t('latestCatalog.title.text1')} text2={t('latestCatalog.title.text2')} />
        <p
          className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600"
          style={{ fontSize: '11px' }}>
          {t('latestCatalog.description')}
        </p>
        <div className="grid py grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 gap-y-4 sm:gap-y-6 mt-6 ">
          {latestProducts.map((product) => (
            <ProductItem key={product._id} {...product} />
          ))}
        </div>
        <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-5 text-center mt-4">
          <Link
            to="/catalog"
            className="text-[20px] hover:underline transition duration-300 ease-in-out transform hover:scale-105 text-textColor">
            {t('latestCatalog.seeMore')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestCatalog;
