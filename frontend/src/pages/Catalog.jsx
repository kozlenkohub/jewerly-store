import React from 'react';
import { useSelector } from 'react-redux';
import { FaChevronDown } from 'react-icons/fa';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Catalog = () => {
  const { products } = useSelector((state) => state.product);
  const [showFilter, setShowFilter] = React.useState(false);
  const [filterProducts, setFilterProducts] = React.useState([]);

  React.useEffect(() => {
    setFilterProducts(products);
  });
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
        {/* category */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? '' : 'hidden'
          } sm:block`}>
          <p className="mb-3 text-sm font-medium">Categories</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" value={'Rings'} /> Rings
            </p>
            <p className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" value={'Earrings'} /> Earrings
            </p>
            <p className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" value={'Pendants'} /> Pendants
            </p>
          </div>
        </div>
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? '' : 'hidden'
          } sm:block`}>
          <p className="mb-3 text-sm font-medium">Metal</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" value={'White Gold'} /> White Gold
            </p>
            <p className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" value={'Yellow Gold'} /> Yellow Gold
            </p>
            <p className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" value={'Red Gold'} /> Red Gold
            </p>
          </div>
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
          {filterProducts.map((item, index) => (
            <ProductItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
