import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './store/slices/authSlice';
import Home from './pages/Home.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import socket from './utils/socket';

function App() {
  const [notification, setNotification] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  // Bootstrap auth on app load if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      // Validate token by fetching current user
      (async () => {
        try {
          const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/me', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });

          if (!res.ok) throw new Error('Invalid token');
          const json = await res.json();
          dispatch(login({ user: json.data, token }));
        } catch (err) {
          localStorage.removeItem('token');
          dispatch(logout());
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connect or disconnect socket when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();

      socket.on('connect', () => {
        console.log('Socket connected', socket.id);
      });

      socket.on('order-notification', (data) => {
        setNotification(data);
      });

      socket.on('stock-update', (data) => {
        setNotification(data);
      });
    } else {
      // clear any notifications and disconnect socket
      setNotification(null);
      try { socket.disconnect(); } catch (e) {}
      socket.off('connect');
      socket.off('order-notification');
      socket.off('stock-update');
    }

    return () => {
      socket.off('connect');
      socket.off('order-notification');
      socket.off('stock-update');
    };
  }, [isAuthenticated]);
  return (
    <div className="App">
      <Header notification={notification} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
