import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import { clearCart } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const subtotal = total;
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const shipping = subtotal > 100 ? 0 : 10;
  const grandTotal = subtotal + tax + shipping;

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-4 text-6xl">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart!</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Items ({items.length})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={() => {}} // Handled by Redux dispatch in CartItem
                  />
                ))}
              </div>
            </div>

            {/* Continue Shopping Link */}
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping !== 0 && (
                  <p className="text-sm text-gray-500">
                    Free shipping on orders over $100
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mb-6 text-lg">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              {isAuthenticated ? (
                <Link
                  to="/checkout"
                  className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Login to Checkout
                </Link>
              )}

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  ✓ Free returns within 30 days
                  <br />✓ Secure checkout with SSL encryption
                  <br />✓ Order tracking available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
