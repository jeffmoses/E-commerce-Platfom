import React from 'react';
import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../store/slices/cartSlice';

const CartItem = ({ item, onQuantityChange }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded overflow-hidden">
        <img
          src={item.image || '/placeholder.jpg'}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.brand}</p>
          </div>
          <p className="text-lg font-bold text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <label htmlFor={`qty-${item.id}`} className="text-sm text-gray-600">
              Qty:
            </label>
            <select
              id={`qty-${item.id}`}
              value={item.quantity}
              onChange={handleQuantityChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">
              ${item.price.toFixed(2)} each
            </p>
            <button
              onClick={handleRemove}
              className="text-red-600 hover:text-red-800 font-semibold text-sm mt-1 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
