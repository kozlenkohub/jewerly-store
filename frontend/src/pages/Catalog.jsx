import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaChevronDown } from 'react-icons/fa';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import Filters from '../components/Filters';
import { fetchProducts } from '../redux/slices/productSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { setSelectedFilters, fetchFilters } from '../redux/slices/filterSlice';
import qs from 'qs';
import { DotLoader } from 'react-spinners';
import useQueryFilters from '../hooks/useQueryFilters';
import Breadcrumb from '../components/Breadcrumb';

const Catalog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { '*': categoryPath } = useParams();
  const lastSegment = categoryPath ? categoryPath.split('/').pop() : '';

  const { search: searchParams } = useLocation();

  useQueryFilters();

  const memoizedSearch = React.useMemo(() => {
    const parsed = qs.parse(searchParams, {
      ignoreQueryPrefix: true,
      arrayFormat: 'repeat',
    });
    Object.keys(parsed).forEach((key) => {
      if (key !== 'price' && typeof parsed[key] === 'string') {
        parsed[key] = [parsed[key]];
      }
    });
    return parsed;
  }, [searchParams]);

  const query = qs.stringify(memoizedSearch, { arrayFormat: 'repeat' });

  const { products, isLoading, isOpenSearch, search } = useSelector((state) => state.product);
  const { selectedFilters } = useSelector((state) => state.filter);
  const [showFilter, setShowFilter] = React.useState(false);
  const [selectedSort, setSelectedSort] = React.useState('relevent');

  const debounceRef = React.useRef(null);

  React.useEffect(() => {
    dispatch(setSelectedFilters(memoizedSearch));
  }, [memoizedSearch, dispatch]);

  React.useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const mergedQuery = qs.stringify(
        { ...memoizedSearch, ...selectedFilters },
        { arrayFormat: 'repeat' },
      );

      if (mergedQuery !== query) {
        navigate(`?${mergedQuery}`);
      }
      dispatch(
        fetchProducts({ slug: lastSegment, query: mergedQuery, sort: selectedSort, search }),
      );
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [
    selectedFilters,
    memoizedSearch,
    query,
    lastSegment,
    navigate,
    dispatch,
    selectedSort,
    search,
  ]);

  React.useEffect(() => {
    dispatch(fetchFilters(lastSegment));
  }, [lastSegment, dispatch]);

  return (
    <div className="max-w-[1280px] mx-auto px-4">
      <div className={` sm:col-span-2 text-left ${!isOpenSearch ? 'mt-20' : ''}`}>
        <Breadcrumb categoryPath={categoryPath} />
      </div>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t  text-center relative">
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2">
            Filters
            <FaChevronDown
              className={`h-3 sm:hidden ${showFilter ? 'transform rotate-180' : ''}`}
              onClick={() => setShowFilter(!showFilter)}
            />
          </p>
          <div className={`${showFilter ? '' : 'hidden'} sm:block`}>
            <Filters categoryId={lastSegment} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-xl mb-4 relative">
            <Title text1={'All'} text2={'Products'} />
            <select
              className="border-2 border-gray-300"
              onChange={(e) => setSelectedSort(e.target.value)}
              value={selectedSort}>
              <option value="relevent">Relevent</option>
              <option value="low-high">Low to High</option>
              <option value="high-low">High to Low</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center sm:absolute top-1/2 right-[44%] ">
              <DotLoader size={50} color={'#8c2d60'} loading={isLoading} speedMultiplier={0.5} />
            </div>
          ) : (
            <div
              className={`grid py grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 gap-y-4 sm:gap-y-6 mt-6 ${
                isLoading ? 'px-4' : ''
              }`}>
              {products.map((item, index) => (
                <ProductItem key={index} {...item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
