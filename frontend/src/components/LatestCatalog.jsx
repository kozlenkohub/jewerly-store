import React from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
import { useSelector } from 'react-redux';

const LatestCatalog = () => {
  const { products } = useSelector((state) => state.product);
  const [latestProducts, setLatestProducts] = React.useState([]);

  React.useEffect(() => {
    const latest = products.slice(0, 5);
    setLatestProducts(latest);
  }, [products]);

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="text-center py-8 text-3xl">
        <Title text1={'Bestseller '} text2={'Catalog'} />
        <p
          className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600"
          style={{ fontSize: '11px' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus nulla tempora expedita
          laboriosam
        </p>
        <div className="grid py grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 gap-y-4 sm:gap-y-6 mt-6 ">
          {latestProducts.map((product) => (
            <ProductItem key={product._id} {...product} />
          ))}
        </div>
        <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-5 text-center mt-4">
          <a
            href="/cart"
            className="text-[20px] hover:underline transition duration-300 ease-in-out transform hover:scale-105 text-textColor">
            See more
          </a>
        </div>
      </div>
    </div>
  );
};

export default LatestCatalog;
