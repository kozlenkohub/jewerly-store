import React from 'react';
import { ShopContext } from '../context/shopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCatalog = () => {
  const { products } = React.useContext(ShopContext);
  console.log(products);
  const [latestProducts, setLatestProducts] = React.useState([]);

  React.useEffect(() => {
    const latest = products.slice(0, 5);
    setLatestProducts(latest);
  }, [products]);

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="text-center py-8 text-3xl">
        <Title text1={'Latest '} text2={'Catalog'} />
        <p
          className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600"
          style={{ fontSize: '11px' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus nulla tempora expedita
          laboriosam
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mt-6">
          {latestProducts.map((product) => (
            <ProductItem key={product.id} {...product} />
          ))}
          <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 text-center mt-4">
            <a
              href="/cart"
              className="text-[20px] hover:underline transition duration-300 ease-in-out transform hover:scale-105">
              See more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestCatalog;
