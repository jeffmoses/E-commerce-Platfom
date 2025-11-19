import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = ({ notification }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">E-commerce</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {notification && (
            <div className="ml-4 bg-yellow-200 text-black px-2 py-1 rounded">
              {typeof notification === 'string' ? notification : notification.message || 'New notification'}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
