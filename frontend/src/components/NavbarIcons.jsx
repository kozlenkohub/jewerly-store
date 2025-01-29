import React from 'react';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toggleSearch } from '../redux/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';

const NavbarIcons = ({ iconColor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpenSearch } = useSelector((state) => state.product);
  const { counter } = useSelector((state) => state.cart);

  const handleSearchClick = () => {
    if (!location.pathname.includes('/catalog')) {
      navigate('/catalog');
      dispatch(toggleSearch(true));
    } else {
      dispatch(toggleSearch(!isOpenSearch));
    }
  };

  return (
    <>
      <FaSearch
        onClick={handleSearchClick}
        className={`w-5 h-5 cursor-pointer sm:block hidden ${iconColor}`}
      />
      <div className={`group relative sm:block hidden ${iconColor}`}>
        <FaUser className={`w-5 h-5 cursor-pointer ${iconColor}`} />
        <div className="group-hover:block hidden absolute dropdown-menu z-50 right-0 pt-2">
          <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
            <p className="cursor-pointer hover:text-black">My Profile</p>
            <p className="cursor-pointer hover:text-black">Orders</p>
            <p className="cursor-pointer hover:text-black">LogOut</p>
          </div>
        </div>
      </div>
      <Link to="/cart" className={`relative sm:block hidden ${iconColor}`}>
        <FaShoppingCart className={`w-5 h-5 ${iconColor}`} />
        {counter > 0 && (
          <p className="absolute right-[-12px] bottom-[-9px] w-[20px] h-[20px] text-center leading-4 bg-secondaryColor text-white aspect-square rounded-full text-[12px]">
            {counter}
          </p>
        )}
      </Link>
    </>
  );
};

export default NavbarIcons;
