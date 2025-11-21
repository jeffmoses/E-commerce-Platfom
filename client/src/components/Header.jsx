import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = ({ notification }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const cartCount = items.length;

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">
            E-Shop
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-blue-100 transition-colors font-semibold"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="hover:text-blue-100 transition-colors font-semibold"
            >
              Products
            </Link>

            {/* Cart Link with Count */}
            <Link
              to="/cart"
              className="relative hover:text-blue-100 transition-colors font-semibold"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="hover:text-blue-100 transition-colors font-semibold"
                >
                  👤 {user?.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-100 transition-colors font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-blue-100 transition-colors font-semibold"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-blue-100 transition-colors font-semibold"
            >
              Products
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-blue-100 transition-colors font-semibold relative"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-blue-100 transition-colors font-semibold"
                >
                  👤 {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-blue-100 transition-colors font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}

        {/* Notification Banner */}
        {notification && (
          <div className="mt-4 bg-yellow-200 text-yellow-900 px-4 py-2 rounded flex justify-between items-center">
            <span>
              {typeof notification === 'string' ? notification : notification.message || 'New notification'}
            </span>
            <button
              onClick={() => {}}
              className="text-yellow-900 hover:text-yellow-800"
            >
              ✕
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
