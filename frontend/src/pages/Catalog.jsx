import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaChevronDown } from 'react-icons/fa';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import Filters from '../components/Filters';
import { fetchProducts } from '../redux/slices/productSlice';
import { useLocation, useNavigate } from 'react-router-dom';

import qs from 'qs';

const Catalog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search: searchParams } = useLocation();

  const search = qs.parse(searchParams, { ignoreQueryPrefix: true });
  const query = qs.stringify(search);

  const { products } = useSelector((state) => state.product);
  const [showFilter, setShowFilter] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchProducts(query));
  }, [dispatch]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t max-w-[1280px] mx-auto px-4 text-center">
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          Filters
          <FaChevronDown
            className={`h-3 sm:hidden ${showFilter ? 'transform rotate-180' : ''}`}
            onClick={() => setShowFilter(!showFilter)}
          />
        </p>
        <div className={`${showFilter ? '' : 'hidden'} sm:block`}>
          <Filters />
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={'All'} text2={'Products'} />
          {/* sort */}
          <select className="border-2 border-gray-300 ">
            <option value="relevent">Relevent</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>
        {/* map product */}
        <div className="grid py grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 gap-y-4 sm:gap-y-6 mt-6">
          {products.map((item, index) => (
            <ProductItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
