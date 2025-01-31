import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaChevronDown, FaSortAmountDown, FaSortAmountUp, FaStar } from 'react-icons/fa';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import Filters from '../components/Filters';
import { fetchProducts } from '../redux/slices/productSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { setSelectedFilters, fetchFilters } from '../redux/slices/filterSlice';
import qs from 'qs';
import { DotLoader } from 'react-spinners';
import Breadcrumb from '../components/Breadcrumb';

const Catalog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { '*': categoryPath } = useParams();
  const lastSegment = categoryPath ? categoryPath.split('/').pop() : '';

  const { search: searchParams } = useLocation();

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

  const { products, isLoading, isOpenSearch, search, activeCategory } = useSelector(
    (state) => state.product,
  );
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

  const sortOptions = [
    { value: 'relevent', icon: <FaStar />, label: 'Relevent' },
    { value: 'low-high', icon: <FaSortAmountUp />, label: 'Low to High' },
    { value: 'high-low', icon: <FaSortAmountDown />, label: 'High to Low' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 min-h-[87vh] ">
      <div className={` sm:col-span-2 text-left ${!isOpenSearch ? 'mt-20' : ''}`}>
        <Breadcrumb categoryPath={categoryPath} />
      </div>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-2 sm:pt-5 border-t  text-center relative">
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
          <div className="flex flex-wrap justify-center sm:justify-between items-center text-base text-xl mb-4 relative sm:flex-row flex-col">
            <Title text1={activeCategory} text2={'Catalog'} />
            <div className="flex gap-2 flex-wrap sm:gap-4 mt-2 sm:mt-0">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`border-2 p-2 w-10 h-10 flex items-center justify-center ${
                    selectedSort === option.value ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedSort(option.value)}>
                  {option.icon}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center sm:absolute top-1/2 right-[44%]  ">
              <DotLoader size={50} color={'#1F3A63'} loading={isLoading} speedMultiplier={0.5} />
            </div>
          ) : (
            <div
              className={`grid py grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 gap-y-4 sm:gap-y-6 mt-6 min-h-[44vh] ${
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
