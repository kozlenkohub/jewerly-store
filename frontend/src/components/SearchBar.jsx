import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearch } from '../redux/slices/productSlice';
import { FaSearch } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { isOpenSearch, search } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleClear = () => {
    dispatch(setSearch(''));
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    dispatch(setSearch(searchValue));
  };

  if (!location.pathname.includes('/catalog')) {
    return null;
  }

  return isOpenSearch ? (
    <div className="mt-12 text-center">
      <div className="relative inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          className="flex-1 bg-inherit text-sm border-none outline-none focus:ring-0"
          type="text"
          placeholder="Search"
          onChange={handleChange}
          value={search}
        />

        {!search ? (
          <FaSearch className="w-4" />
        ) : (
          <FaTimes className="inline w-3 cursor-pointer ml-2" onClick={handleClear} />
        )}
      </div>
    </div>
  ) : null;
};

export default SearchBar;
