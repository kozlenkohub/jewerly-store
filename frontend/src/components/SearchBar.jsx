import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearch, toggleSearch, fetchProducts } from '../redux/slices/productSlice';
import { FaSearch } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

const SearchBar = () => {
  const { isOpenSearch, search } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();
  const debounceRef = useRef(null);

  const handleClear = () => {
    dispatch(setSearch(''));
    dispatch(fetchProducts({ slug: '', query: '', sort: '', search: '' }));
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    dispatch(setSearch(searchValue));

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      dispatch(fetchProducts({ slug: '', query: '', sort: '', search: searchValue }));
    }, 300); // 300ms delay
  };

  if (!location.pathname.includes('/catalog')) {
    return null;
  }

  return isOpenSearch ? (
    <div className="border-t border-b bg-gray-50 mt-20 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          className="flex-1 outline-none focus:outline-none bg-inherit text-sm border-none"
          type="text"
          placeholder="Search"
          onChange={handleChange}
          value={search}
        />
        <FaSearch className="w-4" />
      </div>
      <FaTimes className="inline w-3 cursor-pointer" onClick={handleClear} />
    </div>
  ) : null;
};

export default SearchBar;
