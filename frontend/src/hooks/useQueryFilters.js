import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import qs from 'qs';
import { setSelectedFilters } from '../redux/slices/filterSlice';

const useQueryFilters = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    dispatch(setSelectedFilters(query));
  }, [dispatch, location.search]);
};

export default useQueryFilters;
