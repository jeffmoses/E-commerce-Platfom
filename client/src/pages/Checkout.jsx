import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import { clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Billing, 3: Payment, 4: Review
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState(null);

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty!</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const grandTotal = subtotal + tax + shipping;

  const shippingValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('ZIP code is required'),
    country: Yup.string().required('Country is required'),
  });

  const billingValidationSchema = Yup.object({
    cardName: Yup.string().required('Cardholder name is required'),
    cardNumber: Yup.string()
      .matches(/^\d{16}$/, 'Card number must be 16 digits')
      .required('Card number is required'),
    expiryDate: Yup.string()
      .matches(/^\d{2}\/\d{2}$/, 'Format: MM/YY')
      .required('Expiry date is required'),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, 'CVV must be 3-4 digits')
      .required('CVV is required'),
  });

  const handleCreateOrder = async () => {
    try {
      const shippingData = JSON.parse(localStorage.getItem('shippingData'));
      const billingData = JSON.parse(localStorage.getItem('billingData'));

      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          street: shippingData.street,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
        },
        paymentMethod: 'credit_card',
        totalAmount: grandTotal,
      };

      const response = await api.post('/orders', orderData);
      setOrderId(response.data.data._id);
      setOrderCreated(true);

      // Clear cart and storage
      dispatch(clearCart());
      localStorage.removeItem('shippingData');
      localStorage.removeItem('billingData');

      // Redirect after 3 seconds
      setTimeout(() => navigate(`/orders/${response.data.data._id}`), 3000);
    } catch (error) {
      console.error('Order creation error:', error);
      alert(error.response?.data?.message || 'Failed to create order');
    }
  };

  if (orderCreated) {
    return (
      <div className="bg-green-50 min-h-screen py-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order number is:
          </p>
          <p className="text-xl font-bold text-gray-800 mb-6">{orderId}</p>
          <p className="text-gray-600">
            Redirecting to order details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {/* Progress Indicator */}
            <div className="flex justify-between mb-8">
              {['Shipping', 'Billing', 'Payment', 'Review'].map((label, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center pb-2 ${
                    index + 1 <= step ? 'border-b-2 border-blue-600' : 'border-b-2 border-gray-300'
                  }`}
                >
                  <div
                    className={`inline-block w-8 h-8 rounded-full text-white font-bold mb-2 ${
                      index + 1 <= step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className={`text-sm ${index + 1 <= step ? 'text-blue-600' : 'text-gray-600'}`}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Shipping Address</h2>
                <Formik
                  initialValues={
                    JSON.parse(localStorage.getItem('shippingData')) || {
                      firstName: user?.name?.split(' ')[0] || '',
                      lastName: user?.name?.split(' ')[1] || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      street: user?.address?.street || '',
                      city: user?.address?.city || '',
                      state: user?.address?.state || '',
                      zipCode: user?.address?.zipCode || '',
                      country: user?.address?.country || '',
                    }
                  }
                  validationSchema={shippingValidationSchema}
                  onSubmit={(values) => {
                    localStorage.setItem('shippingData', JSON.stringify(values));
                    setStep(2);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            First Name
                          </label>
                          <Field
                            name="firstName"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Last Name
                          </label>
                          <Field
                            name="lastName"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Phone
                        </label>
                        <Field
                          name="phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Street Address
                        </label>
                        <Field
                          name="street"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="street"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            City
                          </label>
                          <Field
                            name="city"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            State
                          </label>
                          <Field
                            name="state"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="state"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <Field
                            name="zipCode"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="zipCode"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Country
                          </label>
                          <Field
                            name="country"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="country"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => navigate('/cart')}
                          className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold"
                        >
                          Back to Cart
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                        >
                          Continue to Billing
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {/* Step 2: Billing Address */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Billing Address</h2>
                <Formik
                  initialValues={
                    JSON.parse(localStorage.getItem('billingData')) || {
                      cardName: '',
                      cardNumber: '',
                      expiryDate: '',
                      cvv: '',
                    }
                  }
                  validationSchema={billingValidationSchema}
                  onSubmit={(values) => {
                    localStorage.setItem('billingData', JSON.stringify(values));
                    setStep(3);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <Field
                          name="cardName"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="cardName"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Card Number
                        </label>
                        <Field
                          name="cardNumber"
                          placeholder="1234567890123456"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage
                          name="cardNumber"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Expiry Date (MM/YY)
                          </label>
                          <Field
                            name="expiryDate"
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="expiryDate"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            CVV
                          </label>
                          <Field
                            name="cvv"
                            placeholder="123"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <ErrorMessage
                            name="cvv"
                            component="div"
                            className="text-red-600 text-sm mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                        >
                          Review Order
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Review Your Order</h2>

                <div className="mb-6 p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6 p-4 bg-green-50 rounded">
                  <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                  {(() => {
                    const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
                    return (
                      <p className="text-sm text-gray-600">
                        {shippingData.firstName} {shippingData.lastName}
                        <br />
                        {shippingData.street}
                        <br />
                        {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                        <br />
                        {shippingData.country}
                      </p>
                    );
                  })()}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateOrder}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

              <div className="max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-600 mb-2"
                  >
                    <span>{item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
